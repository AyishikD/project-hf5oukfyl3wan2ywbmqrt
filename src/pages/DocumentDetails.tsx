import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Document } from "@/entities";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, FileText, Calendar, Shield } from "lucide-react";

export const DocumentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: document, isLoading } = useQuery({
    queryKey: ["document", id],
    queryFn: async () => {
      try {
        const docs = await Document.filter({ id }, "-created_at", 1);
        return docs[0];
      } catch (error) {
        console.error("Error fetching document:", error);
        return null;
      }
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <Sidebar />
        <main className="ml-64 pt-16">
          <div className="p-6">
            <p>Loading document...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <Sidebar />
        <main className="ml-64 pt-16">
          <div className="p-6">
            <p>Document not found</p>
          </div>
        </main>
      </div>
    );
  }

  const extractedFields = document.extracted_fields
    ? JSON.parse(document.extracted_fields)
    : {};

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />
      
      <main className="ml-64 pt-16">
        <div className="p-6 max-w-6xl animate-fade-in">
          <Button
            variant="ghost"
            onClick={() => navigate("/documents")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Documents
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <FileText className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h1 className="text-2xl font-bold">{document.name}</h1>
                        <p className="text-muted-foreground">{document.type}</p>
                      </div>
                    </div>
                    <Button>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>

                  {document.file_url && (
                    <div className="mt-6">
                      {document.file_url.endsWith(".pdf") ? (
                        <iframe
                          src={document.file_url}
                          className="w-full h-[600px] border rounded-lg"
                        />
                      ) : (
                        <img
                          src={document.file_url}
                          alt={document.name}
                          className="w-full rounded-lg border"
                        />
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">
                    Extracted Fields
                  </h2>
                  {Object.keys(extractedFields).length > 0 ? (
                    <div className="space-y-3">
                      {Object.entries(extractedFields).map(([key, value]) => (
                        <div key={key} className="flex justify-between py-2 border-b">
                          <span className="font-medium capitalize">
                            {key.replace(/_/g, " ")}
                          </span>
                          <span className="text-muted-foreground">
                            {String(value)}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">
                      No extracted fields available
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Details</h2>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Category
                      </p>
                      <Badge variant="outline">{document.category}</Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Status
                      </p>
                      <Badge variant="outline">{document.status}</Badge>
                    </div>
                    {document.expiry_date && (
                      <div className="flex items-center gap-2 p-3 bg-warning/10 rounded-lg">
                        <Calendar className="h-5 w-5 text-warning" />
                        <div>
                          <p className="text-sm font-medium">Expiry Date</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(document.expiry_date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Shield className="h-5 w-5 text-primary" />
                    <h2 className="text-lg font-semibold">Compliance Status</h2>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      document.compliance_status === "Valid"
                        ? "bg-success/10 text-success"
                        : document.compliance_status === "Expiring Soon"
                        ? "bg-warning/10 text-warning"
                        : "bg-destructive/10 text-destructive"
                    }
                  >
                    {document.compliance_status}
                  </Badge>
                  {document.ai_notes && (
                    <p className="mt-4 text-sm text-muted-foreground">
                      {document.ai_notes}
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};