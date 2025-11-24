import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { DocumentUploader } from "@/components/documents/DocumentUploader";
import { useNavigate } from "react-router-dom";

export const Upload = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />
      
      <main className="ml-64 pt-16">
        <div className="p-6 max-w-4xl animate-fade-in">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Upload Documents</h1>
            <p className="text-muted-foreground">
              Upload your documents and let AI extract information automatically
            </p>
          </div>

          <div className="mb-6">
            <img
              src="https://ellprnxjjzatijdxcogk.supabase.co/storage/v1/object/public/files/chat-generated-images/project-hf5oukfyl3wan2ywbmqrt/05e587d3-a903-4196-b8c6-69ca8d8805f5.png"
              alt="AI document management illustration showing organized digital documents"
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>

          <DocumentUploader
            onUploadComplete={() => {
              setTimeout(() => navigate("/documents"), 1500);
            }}
          />

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-card rounded-lg border">
              <h3 className="font-semibold mb-2">Instant OCR</h3>
              <p className="text-sm text-muted-foreground">
                AI extracts text and data from your documents in seconds
              </p>
            </div>
            <div className="p-4 bg-card rounded-lg border">
              <h3 className="font-semibold mb-2">Smart Categorization</h3>
              <p className="text-sm text-muted-foreground">
                Documents are automatically organized by type and category
              </p>
            </div>
            <div className="p-4 bg-card rounded-lg border">
              <h3 className="font-semibold mb-2">Compliance Checks</h3>
              <p className="text-sm text-muted-foreground">
                Get instant alerts for expiring documents and compliance issues
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};