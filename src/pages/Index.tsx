import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { User } from "@/entities";
import { Button } from "@/components/ui/button";
import { FileText, Shield, Bell, Sparkles } from "lucide-react";

export default function Index() {
  const navigate = useNavigate();

  const { data: user, isLoading, error } = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      try {
        return await User.me();
      } catch (error) {
        console.error("Error checking auth:", error);
        return null;
      }
    },
    retry: false,
  });

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleLogin = async () => {
    try {
      await User.login();
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-accent/5 to-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-accent/5 to-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto">
              <span className="text-white font-bold text-2xl">DC</span>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              DocuCompliance
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Your AI-powered assistant for managing documents, tracking deadlines, and staying compliant
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 py-12">
            <div className="p-6 bg-card rounded-lg border shadow-sm">
              <FileText className="h-10 w-10 text-primary mb-4" />
              <h3 className="font-semibold mb-2">Smart Document Management</h3>
              <p className="text-sm text-muted-foreground">
                Upload and organize all your important documents in one secure place
              </p>
            </div>
            <div className="p-6 bg-card rounded-lg border shadow-sm">
              <Shield className="h-10 w-10 text-accent mb-4" />
              <h3 className="font-semibold mb-2">Compliance Tracking</h3>
              <p className="text-sm text-muted-foreground">
                Never miss a deadline with intelligent compliance monitoring
              </p>
            </div>
            <div className="p-6 bg-card rounded-lg border shadow-sm">
              <Bell className="h-10 w-10 text-warning mb-4" />
              <h3 className="font-semibold mb-2">Smart Reminders</h3>
              <p className="text-sm text-muted-foreground">
                Get notified before important dates and required actions
              </p>
            </div>
            <div className="p-6 bg-card rounded-lg border shadow-sm">
              <Sparkles className="h-10 w-10 text-success mb-4" />
              <h3 className="font-semibold mb-2">AI Assistant</h3>
              <p className="text-sm text-muted-foreground">
                Chat with your documents and get instant insights
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <Button
              size="lg"
              className="text-lg px-8 py-6"
              onClick={handleLogin}
            >
              Get Started
            </Button>
            {error && (
              <p className="text-sm text-muted-foreground">
                Having trouble connecting? Please try again in a moment.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}