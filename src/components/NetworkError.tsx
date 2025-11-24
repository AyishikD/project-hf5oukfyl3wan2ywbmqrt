import { Button } from "@/components/ui/button";
import { WifiOff, RefreshCw } from "lucide-react";

interface NetworkErrorProps {
  onRetry?: () => void;
}

export const NetworkError = ({ onRetry }: NetworkErrorProps) => {
  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-6 animate-fade-in">
      <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-6">
        <WifiOff className="h-10 w-10 text-muted-foreground" />
      </div>
      
      <h2 className="text-2xl font-semibold mb-2">Connection Issue</h2>
      <p className="text-muted-foreground text-center max-w-md mb-6">
        We're having trouble connecting to the server. Please check your internet connection and try again.
      </p>
      
      <Button onClick={handleRetry} size="lg">
        <RefreshCw className="mr-2 h-4 w-4" />
        Try Again
      </Button>
    </div>
  );
};