import { Bell, User, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { User as UserEntity } from "@/entities";
import { useQuery } from "@tanstack/react-query";
import { Notification } from "@/entities";
import { useEffect } from "react";

export const Header = () => {
  const navigate = useNavigate();
  
  const { data: user, error: userError } = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      try {
        return await UserEntity.me();
      } catch (error) {
        console.error("Error fetching user:", error);
        throw error;
      }
    },
    retry: false,
  });

  const { data: unreadCount = 0 } = useQuery({
    queryKey: ["unreadNotifications"],
    queryFn: async () => {
      try {
        const notifications = await Notification.filter({ read: false }, "-created_at", 100);
        return notifications.length;
      } catch (error) {
        console.error("Error fetching notifications:", error);
        return 0;
      }
    },
    enabled: !!user,
  });

  useEffect(() => {
    if (userError) {
      UserEntity.login();
    }
  }, [userError]);

  const handleLogout = async () => {
    try {
      await UserEntity.logout();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <span className="text-white font-bold text-sm">DC</span>
          </div>
          <span className="font-semibold text-lg">DocuCompliance</span>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={() => navigate("/notifications")}
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
              >
                {unreadCount > 9 ? "9+" : unreadCount}
              </Badge>
            )}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5 text-sm font-medium">
                {user?.full_name || user?.email}
              </div>
              <DropdownMenuItem onClick={() => navigate("/settings")}>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};