import { Building2, User, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface EntityCardProps {
  id: string;
  name: string;
  type: string;
  email?: string;
  compliance_status: string;
  risk_level: string;
}

export const EntityCard = ({
  id,
  name,
  type,
  email,
  compliance_status,
  risk_level,
}: EntityCardProps) => {
  const navigate = useNavigate();

  const getComplianceColor = () => {
    switch (compliance_status) {
      case "Compliant":
        return "bg-success/10 text-success";
      case "At Risk":
        return "bg-warning/10 text-warning";
      case "Non-Compliant":
        return "bg-destructive/10 text-destructive";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getRiskColor = () => {
    switch (risk_level) {
      case "Low":
        return "bg-success/10 text-success";
      case "Medium":
        return "bg-warning/10 text-warning";
      case "High":
        return "bg-destructive/10 text-destructive";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Card className="hover:shadow-md transition-all">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
              {type === "Business" ? (
                <Building2 className="h-6 w-6 text-primary" />
              ) : (
                <User className="h-6 w-6 text-primary" />
              )}
            </div>
            <div>
              <h3 className="font-semibold">{name}</h3>
              {email && (
                <p className="text-sm text-muted-foreground">{email}</p>
              )}
            </div>
          </div>
          <Badge variant="outline">{type}</Badge>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Compliance Status
            </span>
            <Badge variant="outline" className={getComplianceColor()}>
              {compliance_status}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Risk Level</span>
            <Badge variant="outline" className={getRiskColor()}>
              {risk_level}
            </Badge>
          </div>
        </div>

        {risk_level === "High" && (
          <div className="flex items-center gap-2 p-3 bg-destructive/10 rounded-lg mb-4">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <p className="text-sm text-destructive font-medium">
              Requires immediate attention
            </p>
          </div>
        )}

        <Button
          variant="outline"
          className="w-full"
          onClick={() => navigate(`/entities/${id}`)}
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};