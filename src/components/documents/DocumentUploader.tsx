import { useCallback, useState } from "react";
import { Upload, File, X, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { uploadFile, extractDataFromUploadedFile, invokeLLM } from "@/integrations/core";
import { Document } from "@/entities";
import { useQueryClient } from "@tanstack/react-query";

interface DocumentUploaderProps {
  onUploadComplete?: () => void;
}

export const DocumentUploader = ({ onUploadComplete }: DocumentUploaderProps) => {
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...files]);
    }
  }, []);

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const processDocument = async (fileUrl: string, fileName: string) => {
    try {
      setProcessing(true);

      const aiAnalysis = await invokeLLM({
        prompt: `Analyze this document and provide the following information:
        1. Document type (e.g., GST Certificate, PAN Card, Aadhaar, Bank Statement, Invoice, Agreement, etc.)
        2. Category (Personal IDs, Business Registrations, Tax, Legal, HR, Banking, Insurance, Compliance Notices, Agreements)
        3. Key extracted fields (dates, numbers, names, amounts, etc.)
        4. Compliance status (Valid, Expiring Soon, Expired, Action Required)
        5. Any expiry date if applicable
        6. AI notes and insights
        
        Document name: ${fileName}`,
        file_urls: [fileUrl],
        response_json_schema: {
          type: "object",
          properties: {
            document_type: { type: "string" },
            category: { type: "string" },
            extracted_fields: {
              type: "object",
              additionalProperties: true
            },
            compliance_status: { type: "string" },
            expiry_date: { type: "string" },
            ai_notes: { type: "string" }
          }
        }
      });

      const extractedData = aiAnalysis as any;

      await Document.create({
        name: fileName,
        type: extractedData.document_type || "Unknown",
        category: extractedData.category || "Uncategorized",
        file_url: fileUrl,
        extracted_fields: JSON.stringify(extractedData.extracted_fields || {}),
        compliance_status: extractedData.compliance_status || "Valid",
        expiry_date: extractedData.expiry_date || "",
        ai_notes: extractedData.ai_notes || "",
        status: "Ready",
      });

      toast({
        title: "Document processed!",
        description: `${fileName} has been analyzed and stored.`,
      });
    } catch (error) {
      console.error("Error processing document:", error);
      toast({
        title: "Processing error",
        description: "Failed to analyze document. It's been saved for manual review.",
        variant: "destructive",
      });

      await Document.create({
        name: fileName,
        type: "Unknown",
        category: "Uncategorized",
        file_url: fileUrl,
        status: "Needs Review",
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    setUploading(true);

    try {
      for (const file of selectedFiles) {
        const { file_url } = await uploadFile({ file });
        await processDocument(file_url, file.name);
      }

      queryClient.invalidateQueries({ queryKey: ["recentDocuments"] });
      queryClient.invalidateQueries({ queryKey: ["allDocuments"] });
      
      setSelectedFiles([]);
      
      if (onUploadComplete) {
        onUploadComplete();
      }

      toast({
        title: "Upload complete!",
        description: `${selectedFiles.length} document${
          selectedFiles.length > 1 ? "s" : ""
        } uploaded successfully.`,
      });
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your documents.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="border-2 border-dashed border-primary/20 rounded-lg p-8 text-center hover:border-primary/40 transition-colors">
            <input
              type="file"
              multiple
              accept=".pdf,.png,.jpg,.jpeg,.csv"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
              disabled={uploading || processing}
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <Upload className="h-12 w-12 mx-auto mb-4 text-primary" />
              <p className="text-lg font-medium mb-2">
                Drop files here or click to browse
              </p>
              <p className="text-sm text-muted-foreground">
                Supports PDF, PNG, JPG, JPEG, CSV
              </p>
            </label>
          </div>

          {selectedFiles.length > 0 && (
            <div className="space-y-2">
              {selectedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <File className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium text-sm">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFile(index)}
                    disabled={uploading || processing}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {selectedFiles.length > 0 && (
            <Button
              onClick={handleUpload}
              disabled={uploading || processing}
              className="w-full"
            >
              {uploading || processing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {processing ? "AI is analyzing..." : "Uploading..."}
                </>
              ) : (
                `Upload ${selectedFiles.length} file${
                  selectedFiles.length > 1 ? "s" : ""
                }`
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};