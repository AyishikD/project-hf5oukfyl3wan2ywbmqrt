import { useState, useRef, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Send, Upload, Loader2 } from "lucide-react";
import { invokeLLM, uploadFile } from "@/integrations/core";
import { Document, Deadline } from "@/entities";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export const AIChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm your AI compliance assistant. I can help you with:\n\n• Understanding your deadlines\n• Analyzing documents\n• Checking compliance status\n• Answering questions about your documents\n\nHow can I help you today?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getContextualData = async () => {
    try {
      const [docs, deadlines] = await Promise.all([
        Document.list("-created_at", 10),
        Deadline.filter({ status: "Pending" }, "due_date", 10),
      ]);
      return { docs, deadlines };
    } catch (error) {
      console.error("Error fetching contextual data:", error);
      return { docs: [], deadlines: [] };
    }
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const { docs, deadlines } = await getContextualData();
      
      const contextPrompt = `User question: ${input}

Available context:
Recent Documents: ${docs.map((d: any) => `${d.name} (${d.type})`).join(", ")}
Upcoming Deadlines: ${deadlines.map((d: any) => `${d.title} - Due ${d.due_date}`).join(", ")}

Please provide a helpful, concise response based on this context. If the question is about specific documents or deadlines, reference them. If you need more information, ask clarifying questions.`;

      const response = await invokeLLM({
        prompt: contextPrompt,
      });

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response as string,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error getting AI response:", error);
      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);

    try {
      const { file_url } = await uploadFile({ file });

      const userMessage: Message = {
        id: Date.now().toString(),
        text: `Uploaded: ${file.name}`,
        isUser: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMessage]);

      const analysis = await invokeLLM({
        prompt: `Analyze this document and provide a summary including:
        1. Document type
        2. Key information extracted
        3. Any compliance concerns
        4. Recommended actions
        
        Be specific and actionable.`,
        file_urls: [file_url],
      });

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: analysis as string,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);

      toast({
        title: "Document analyzed",
        description: "The AI has analyzed your document.",
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({
        title: "Upload failed",
        description: "Failed to upload and analyze the document.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const suggestedPrompts = [
    "What deadlines do I have this month?",
    "Is my business compliant?",
    "Show me expired documents",
    "What documents need renewal?",
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />
      
      <main className="ml-64 pt-16">
        <div className="h-[calc(100vh-4rem)] flex flex-col">
          <div className="p-6 border-b">
            <h1 className="text-2xl font-bold">AI Assistant</h1>
            <p className="text-muted-foreground">
              Ask me anything about your documents and compliance
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message.text}
                isUser={message.isUser}
                timestamp={message.timestamp}
              />
            ))}
            {loading && (
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <Loader2 className="h-5 w-5 text-white animate-spin" />
                </div>
                <div className="bg-card border rounded-lg p-4">
                  <p className="text-muted-foreground">AI is thinking...</p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {messages.length === 1 && (
            <div className="px-6 pb-4">
              <div className="flex flex-wrap gap-2">
                {suggestedPrompts.map((prompt, i) => (
                  <Button
                    key={i}
                    variant="outline"
                    size="sm"
                    onClick={() => setInput(prompt)}
                  >
                    {prompt}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div className="p-6 border-t bg-background">
            <div className="flex gap-2">
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={handleFileUpload}
                className="hidden"
                id="chat-file-upload"
                disabled={loading}
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => document.getElementById("chat-file-upload")?.click()}
                disabled={loading}
              >
                <Upload className="h-5 w-5" />
              </Button>
              <Input
                placeholder="Ask me anything..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                disabled={loading}
              />
              <Button onClick={handleSend} disabled={loading || !input.trim()}>
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};