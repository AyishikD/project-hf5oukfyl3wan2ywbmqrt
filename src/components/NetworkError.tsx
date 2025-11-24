import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { WifiOff, RefreshCw } from "lucide-react";

export const NetworkError = () => {
  const handleRefresh = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardContent className="pt-6 text-center space-y-6">
          <div className="flex justify-center">
            <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
              <WifiOff className="h-8 w-8 text-destructive" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Connection Error</h2>
            <p className="text-muted-foreground">
              We're having trouble connecting. This could be due to:
            </p>
            <ul className="text-sm text-muted-foreground text-left space-y-1 pl-6">
              <li>• Network connectivity issues</li>
              <li>• You may not be logged in</li>
              <li>• Temporary service interruption</li>
            </ul>
          </div>

          <div className="flex gap-3 justify-center">
            <Button onClick={handleRefresh} variant="default">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
            <Button onClick={handleGoHome} variant="outline">
              Go Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};