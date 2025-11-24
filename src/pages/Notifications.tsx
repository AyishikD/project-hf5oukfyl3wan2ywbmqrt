import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { NotificationItem } from "@/components/notifications/NotificationItem";
import { Notification } from "@/entities";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const Notifications = () => {
  const [filter, setFilter] = useState("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      try {
        return await Notification.list("-created_at", 100);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        return [];
      }
    },
  });

  const markAsRead = useMutation({
    mutationFn: async (id: string) => {
      return await Notification.update(id, { read: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unreadNotifications"] });
    },
  });

  const markAllAsRead = useMutation({
    mutationFn: async () => {
      const unreadNotifs = notifications.filter((n: any) => !n.read);
      const updates = unreadNotifs.map((n: any) =>
        Notification.update(n.id, { read: true })
      );
      return Promise.all(updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unreadNotifications"] });
      toast({
        title: "All notifications marked as read",
        description: "You're all caught up!",
      });
    },
  });

  const filteredNotifications = notifications.filter((n: any) => {
    if (filter === "unread") return !n.read;
    if (filter === "read") return n.read;
    return true;
  });

  const unreadCount = notifications.filter((n: any) => !n.read).length;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />
      
      <main className="ml-64 pt-16">
        <div className="p-6 animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Notifications</h1>
              <p className="text-muted-foreground">
                Stay updated on deadlines and compliance alerts
              </p>
            </div>
            {unreadCount > 0 && (
              <Button onClick={() => markAllAsRead.mutate()}>
                <CheckCheck className="h-4 w-4 mr-2" />
                Mark All as Read
              </Button>
            )}
          </div>

          <div className="mb-6">
            <img
              src="https://ellprnxjjzatijdxcogk.supabase.co/storage/v1/object/public/files/chat-generated-images/project-hf5oukfyl3wan2ywbmqrt/3c5402ef-28b0-4b2d-bc97-d12abcaf5bd8.png"
              alt="Compliance and deadline management illustration"
              className="w-full h-48 object-cover rounded-lg"
            />
          </div>

          <Tabs value={filter} onValueChange={setFilter} className="mb-6">
            <TabsList>
              <TabsTrigger value="all">
                All ({notifications.length})
              </TabsTrigger>
              <TabsTrigger value="unread">
                Unread ({unreadCount})
              </TabsTrigger>
              <TabsTrigger value="read">
                Read ({notifications.length - unreadCount})
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading notifications...</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {filter === "unread"
                  ? "No unread notifications"
                  : filter === "read"
                  ? "No read notifications"
                  : "No notifications yet"}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredNotifications.map((notification: any) => (
                <NotificationItem
                  key={notification.id}
                  id={notification.id}
                  title={notification.title}
                  message={notification.message}
                  type={notification.type}
                  priority={notification.priority}
                  read={notification.read}
                  created_at={notification.created_at}
                  action_url={notification.action_url}
                  onMarkAsRead={(id) => markAsRead.mutate(id)}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};