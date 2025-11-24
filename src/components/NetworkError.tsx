import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface NetworkErrorProps {
  onRetry?: () => void;
}

export const NetworkError = ({ onRetry }: NetworkErrorProps) => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertCircle className="h-6 w-6 text-destructive" />
          </div>
          <CardTitle>Connection Problem</CardTitle>
          <CardDescription>
            We're having trouble connecting to the server. This could be due to:
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>Your internet connection</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>Temporary server maintenance</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>Network firewall or security settings</span>
            </li>
          </ul>
          
          {onRetry && (
            <Button 
              onClick={onRetry} 
              className="w-full"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          )}
          
          <p className="text-xs text-center text-muted-foreground">
            If the problem persists, please check your internet connection and try again in a few minutes.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};