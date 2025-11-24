import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Entity, Document, Deadline } from "@/entities";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Building2, User, Mail, Phone, Shield } from "lucide-react";

export const EntityDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: entity } = useQuery({
    queryKey: ["entity", id],
    queryFn: async () => {
      try {
        const entities = await Entity.filter({ id }, "-created_at", 1);
        return entities[0];
      } catch (error) {
        console.error("Error fetching entity:", error);
        return null;
      }
    },
  });

  const { data: entityDocs = [] } = useQuery({
    queryKey: ["entityDocuments", id],
    queryFn: async () => {
      try {
        return await Document.filter({ entity_id: id }, "-created_at", 20);
      } catch (error) {
        console.error("Error fetching entity documents:", error);
        return [];
      }
    },
  });

  const { data: entityDeadlines = [] } = useQuery({
    queryKey: ["entityDeadlines", id],
    queryFn: async () => {
      try {
        return await Deadline.filter({ entity_id: id }, "due_date", 10);
      } catch (error) {
        console.error("Error fetching entity deadlines:", error);
        return [];
      }
    },
  });

  if (!entity) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <Sidebar />
        <main className="ml-64 pt-16">
          <div className="p-6">
            <p>Loading...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />
      
      <main className="ml-64 pt-16">
        <div className="p-6 max-w-6xl animate-fade-in">
          <Button
            variant="ghost"
            onClick={() => navigate("/entities")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Entities
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-3">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center">
                      {entity.type === "Business" ? (
                        <Building2 className="h-8 w-8 text-primary" />
                      ) : (
                        <User className="h-8 w-8 text-primary" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h1 className="text-3xl font-bold">{entity.name}</h1>
                        <Badge variant="outline">{entity.type}</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-muted-foreground">
                        {entity.email && (
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            {entity.email}
                          </div>
                        )}
                        {entity.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            {entity.phone}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold">Compliance Overview</h2>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <Badge
                      variant="outline"
                      className={
                        entity.compliance_status === "Compliant"
                          ? "bg-success/10 text-success"
                          : entity.compliance_status === "At Risk"
                          ? "bg-warning/10 text-warning"
                          : "bg-destructive/10 text-destructive"
                      }
                    >
                      {entity.compliance_status}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Risk Level</span>
                    <Badge
                      variant="outline"
                      className={
                        entity.risk_level === "Low"
                          ? "bg-success/10 text-success"
                          : entity.risk_level === "Medium"
                          ? "bg-warning/10 text-warning"
                          : "bg-destructive/10 text-destructive"
                      }
                    >
                      {entity.risk_level}
                    </Badge>
                  </div>
                </div>

                {entity.type === "Business" && (
                  <div className="mt-6 pt-6 border-t space-y-3">
                    <h3 className="font-semibold mb-3">Business Details</h3>
                    {entity.pan && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">PAN</span>
                        <span className="text-sm font-medium">{entity.pan}</span>
                      </div>
                    )}
                    {entity.gstin && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">GSTIN</span>
                        <span className="text-sm font-medium">{entity.gstin}</span>
                      </div>
                    )}
                    {entity.business_type && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Type</span>
                        <span className="text-sm font-medium">{entity.business_type}</span>
                      </div>
                    )}
                  </div>
                )}

                {entity.type === "Person" && (
                  <div className="mt-6 pt-6 border-t space-y-3">
                    <h3 className="font-semibold mb-3">Personal Details</h3>
                    {entity.pan && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">PAN</span>
                        <span className="text-sm font-medium">{entity.pan}</span>
                      </div>
                    )}
                    {entity.aadhaar && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Aadhaar</span>
                        <span className="text-sm font-medium">
                          {entity.aadhaar.replace(/(\d{4})/g, "$1 ")}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">
                  Upcoming Deadlines ({entityDeadlines.length})
                </h2>
                {entityDeadlines.length > 0 ? (
                  <div className="space-y-3">
                    {entityDeadlines.slice(0, 5).map((deadline: any) => (
                      <div
                        key={deadline.id}
                        className="flex justify-between items-center p-3 border rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{deadline.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {deadline.category}
                          </p>
                        </div>
                        <Badge variant="outline">
                          {new Date(deadline.due_date).toLocaleDateString()}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-6">
                    No upcoming deadlines
                  </p>
                )}
              </CardContent>
            </Card>

            <Card className="lg:col-span-3">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">
                  Documents ({entityDocs.length})
                </h2>
                {entityDocs.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {entityDocs.map((doc: any) => (
                      <div
                        key={doc.id}
                        className="p-3 border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors"
                        onClick={() => navigate(`/documents/${doc.id}`)}
                      >
                        <p className="font-medium truncate">{doc.name}</p>
                        <p className="text-sm text-muted-foreground">{doc.type}</p>
                        <Badge variant="outline" className="mt-2">
                          {doc.category}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-6">
                    No documents associated with this entity
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};