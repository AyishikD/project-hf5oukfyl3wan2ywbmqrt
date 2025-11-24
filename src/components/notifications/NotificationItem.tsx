import { AlertCircle, Calendar, FileText, Bell, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface NotificationItemProps {
  id: string;
  title: string;
  message: string;
  type: string;
  priority: string;
  read: boolean;
  created_at: string;
  action_url?: string;
  onMarkAsRead: (id: string) => void;
}

export const NotificationItem = ({
  id,
  title,
  message,
  type,
  priority,
  read,
  created_at,
  action_url,
  onMarkAsRead,
}: NotificationItemProps) => {
  const navigate = useNavigate();

  const getIcon = () => {
    switch (type) {
      case "Deadline":
        return <Calendar className="h-5 w-5" />;
      case "Compliance Warning":
        return <AlertCircle className="h-5 w-5" />;
      case "Missing Document":
        return <FileText className="h-5 w-5" />;
      case "Regulatory Change":
        return <TrendingUp className="h-5 w-5" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

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

  const handleClick = () => {
    if (!read) {
      onMarkAsRead(id);
    }
    if (action_url) {
      navigate(action_url);
    }
  };

  return (
    <Card
      className={`hover:shadow-md transition-all cursor-pointer ${
        !read ? "border-primary" : ""
      }`}
      onClick={handleClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
            {getIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold">{title}</h3>
              <div className="flex items-center gap-2">
                {!read && (
                  <div className="h-2 w-2 rounded-full bg-primary" />
                )}
                <Badge variant={getPriorityColor() as any} className="text-xs">
                  {priority}
                </Badge>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-2">{message}</p>
            <p className="text-xs text-muted-foreground">
              {new Date(created_at).toLocaleDateString()} at{" "}
              {new Date(created_at).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};