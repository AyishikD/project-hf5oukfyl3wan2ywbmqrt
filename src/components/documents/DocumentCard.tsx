import { FileText, Download, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface DocumentCardProps {
  id: string;
  name: string;
  type: string;
  category: string;
  status: string;
  created_at: string;
}

export const DocumentCard = ({
  id,
  name,
  type,
  category,
  status,
  created_at,
}: DocumentCardProps) => {
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ready":
        return "bg-success/10 text-success";
      case "Processing":
        return "bg-warning/10 text-warning";
      case "Needs Review":
        return "bg-destructive/10 text-destructive";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Card className="hover:shadow-md transition-all cursor-pointer">
      <CardContent className="p-4">
        <div
          className="flex items-start gap-4"
          onClick={() => navigate(`/documents/${id}`)}
        >
          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold mb-1 truncate">{name}</h3>
            <p className="text-sm text-muted-foreground mb-2">{type}</p>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline">{category}</Badge>
              <Badge variant="outline" className={getStatusColor(status)}>
                {status}
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex gap-2 mt-3 pt-3 border-t">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/documents/${id}`);
            }}
          >
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};