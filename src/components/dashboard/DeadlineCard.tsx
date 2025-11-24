import { Calendar, AlertCircle, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DeadlineCardProps {
  id: string;
  title: string;
  dueDate: string;
  category: string;
  priority: string;
  status: string;
  onClick?: () => void;
}

export const DeadlineCard = ({
  title,
  dueDate,
  category,
  priority,
  status,
  onClick,
}: DeadlineCardProps) => {
  const getDaysUntil = (dateStr: string) => {
    const due = new Date(dateStr);
    const now = new Date();
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntil = getDaysUntil(dueDate);

  const getPriorityColor = () => {
    if (priority === "High" || daysUntil < 7) return "text-destructive";
    if (priority === "Medium" || daysUntil < 30) return "text-warning";
    return "text-success";
  };

  const getPriorityBg = () => {
    if (priority === "High" || daysUntil < 7) return "bg-destructive/10";
    if (priority === "Medium" || daysUntil < 30) return "bg-warning/10";
    return "bg-success/10";
  };

  return (
    <Card
      className={cn(
        "hover:shadow-md transition-all cursor-pointer",
        status === "Completed" && "opacity-60"
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            {status === "Completed" ? (
              <CheckCircle2 className="h-5 w-5 text-success" />
            ) : (
              <AlertCircle className={cn("h-5 w-5", getPriorityColor())} />
            )}
            <h3 className="font-semibold">{title}</h3>
          </div>
          <Badge variant="outline" className={getPriorityBg()}>
            {category}
          </Badge>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
          <Calendar className="h-4 w-4" />
          <span>
            {status === "Completed"
              ? "Completed"
              : daysUntil > 0
              ? `Due in ${daysUntil} day${daysUntil > 1 ? "s" : ""}`
              : daysUntil === 0
              ? "Due today"
              : `Overdue by ${Math.abs(daysUntil)} day${
                  Math.abs(daysUntil) > 1 ? "s" : ""
                }`}
          </span>
        </div>

        {status !== "Completed" && (
          <Button variant="outline" size="sm" className="w-full">
            View Details
          </Button>
        )}
      </CardContent>
    </Card>
  );
};