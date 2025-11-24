import { Lightbulb, X, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface SuggestionCardProps {
  id: string;
  title: string;
  message: string;
  type: string;
  priority: string;
  onDismiss: (id: string) => void;
  onAction: (id: string) => void;
}

export const SuggestionCard = ({
  id,
  title,
  message,
  type,
  priority,
  onDismiss,
  onAction,
}: SuggestionCardProps) => {
  const getPriorityColor = () => {
    switch (priority) {
      case "High":
        return "destructive";
      case "Medium":
        return "default";
      default:
        return "secondary";
    }
  };

  return (
    <Card className="hover:shadow-md transition-all">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
            <Lightbulb className="h-5 w-5 text-accent" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-semibold">{title}</h4>
              <Badge variant={getPriorityColor() as any}>{priority}</Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-3">{message}</p>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => onAction(id)}>
                <Check className="h-4 w-4 mr-1" />
                Take Action
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onDismiss(id)}
              >
                <X className="h-4 w-4 mr-1" />
                Dismiss
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};