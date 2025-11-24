import { Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface AIBannerProps {
  userName: string;
  urgentCount: number;
}

export const AIBanner = ({ userName, urgentCount }: AIBannerProps) => {
  const navigate = useNavigate();

  return (
    <Card className="p-6 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border-primary/20">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Good day, {userName}!</h2>
          </div>
          <p className="text-muted-foreground">
            {urgentCount > 0 ? (
              <>
                <span className="font-semibold text-primary">
                  {urgentCount} compliance task{urgentCount > 1 ? "s" : ""}
                </span>{" "}
                need your attention
              </>
            ) : (
              "Everything looks good! All your compliance tasks are on track."
            )}
          </p>
        </div>
        <Button onClick={() => navigate("/ai-chat")} className="ml-4">
          Ask AI Assistant
        </Button>
      </div>
    </Card>
  );
};