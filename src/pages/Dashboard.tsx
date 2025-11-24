import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { AIBanner } from "@/components/dashboard/AIBanner";
import { DeadlineCard } from "@/components/dashboard/DeadlineCard";
import { RecentDocuments } from "@/components/dashboard/RecentDocuments";
import { SuggestionCard } from "@/components/dashboard/SuggestionCard";
import { NetworkError } from "@/components/NetworkError";
import { User, Deadline, Document, AISuggestion } from "@/entities";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

const isNetworkError = (error: any) => {
  return error?.message === "Failed to fetch" || 
         error?.name === "TypeError" ||
         !navigator.onLine;
};

export const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: user, error: userError, isLoading: userLoading, refetch: refetchUser } = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      try {
        return await User.me();
      } catch (error) {
        console.error("Error fetching user:", error);
        throw error;
      }
    },
    retry: 1,
    retryDelay: 1000,
  });

  useEffect(() => {
    if (userError && !isNetworkError(userError)) {
      User.login();
    }
  }, [userError]);

  const { data: deadlines = [] } = useQuery({
    queryKey: ["upcomingDeadlines"],
    queryFn: async () => {
      try {
        return await Deadline.filter(
          { status: "Pending" },
          "due_date",
          6
        );
      } catch (error) {
        console.error("Error fetching deadlines:", error);
        return [];
      }
    },
    enabled: !!user,
  });

  const { data: recentDocs = [] } = useQuery({
    queryKey: ["recentDocuments"],
    queryFn: async () => {
      try {
        return await Document.list("-created_at", 5);
      } catch (error) {
        console.error("Error fetching documents:", error);
        return [];
      }
    },
    enabled: !!user,
  });

  const { data: suggestions = [] } = useQuery({
    queryKey: ["aiSuggestions"],
    queryFn: async () => {
      try {
        return await AISuggestion.filter(
          { status: "New" },
          "-created_at",
          4
        );
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        return [];
      }
    },
    enabled: !!user,
  });

  const dismissSuggestion = useMutation({
    mutationFn: async (id: string) => {
      return await AISuggestion.update(id, { status: "Dismissed" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["aiSuggestions"] });
      toast({
        title: "Suggestion dismissed",
        description: "The AI suggestion has been dismissed.",
      });
    },
  });

  const actionSuggestion = useMutation({
    mutationFn: async (id: string) => {
      return await AISuggestion.update(id, { 
        status: "Actioned",
        action_taken: true 
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["aiSuggestions"] });
      toast({
        title: "Action taken",
        description: "Thanks for taking action on this suggestion!",
      });
    },
  });

  const urgentCount = deadlines.filter((d: any) => {
    const daysUntil = Math.ceil(
      (new Date(d.due_date).getTime() - new Date().getTime()) /
        (1000 * 60 * 60 * 24)
    );
    return daysUntil <= 7;
  }).length;

  if (userError && isNetworkError(userError)) {
    return <NetworkError onRetry={() => refetchUser()} />;
  }

  if (userLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />
      
      <main className="ml-64 pt-16">
        <div className="p-6 space-y-6 animate-fade-in">
          <AIBanner
            userName={user?.full_name?.split(" ")[0] || "there"}
            urgentCount={urgentCount}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">
                  Upcoming Deadlines
                </h2>
                <div className="space-y-3">
                  {deadlines.slice(0, 4).map((deadline: any) => (
                    <DeadlineCard
                      key={deadline.id}
                      id={deadline.id}
                      title={deadline.title}
                      dueDate={deadline.due_date}
                      category={deadline.category}
                      priority={deadline.priority}
                      status={deadline.status}
                      onClick={() => navigate(`/deadline/${deadline.id}`)}
                    />
                  ))}
                  {deadlines.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No upcoming deadlines.</p>
                    </div>
                  )}
                </div>
              </div>

              <RecentDocuments documents={recentDocs} />
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">AI Suggestions</h2>
              <div className="space-y-3">
                {suggestions.map((suggestion: any) => (
                  <SuggestionCard
                    key={suggestion.id}
                    id={suggestion.id}
                    title={suggestion.title}
                    message={suggestion.message}
                    type={suggestion.type}
                    priority={suggestion.priority}
                    onDismiss={(id) => dismissSuggestion.mutate(id)}
                    onAction={(id) => actionSuggestion.mutate(id)}
                  />
                ))}
                {suggestions.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <p>No new AI suggestions at the moment.</p>
                    <p className="text-sm mt-2">
                      Upload documents to get intelligent insights!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};