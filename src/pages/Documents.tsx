import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { DocumentCard } from "@/components/documents/DocumentCard";
import { Document, User } from "@/entities";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter } from "lucide-react";

export const Documents = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: user, error: userError, isLoading: userLoading } = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      try {
        return await User.me();
      } catch (error) {
        console.error("Error fetching user:", error);
        throw error;
      }
    },
    retry: false,
  });

  useEffect(() => {
    if (userError) {
      User.login();
    }
  }, [userError]);

  const { data: documents = [], isLoading } = useQuery({
    queryKey: ["allDocuments"],
    queryFn: async () => {
      try {
        return await Document.list("-created_at", 100);
      } catch (error) {
        console.error("Error fetching documents:", error);
        return [];
      }
    },
    enabled: !!user,
  });

  const filteredDocuments = documents.filter((doc: any) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || doc.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || doc.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const categories = [
    "Personal IDs",
    "Business Registrations",
    "Tax",
    "Legal",
    "HR",
    "Banking",
    "Insurance",
    "Compliance Notices",
    "Agreements",
  ];

  if (userLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
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
        <div className="p-6 animate-fade-in">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Document Library</h1>
            <p className="text-muted-foreground">
              All your documents organized and ready to access
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Ready">Ready</SelectItem>
                <SelectItem value="Processing">Processing</SelectItem>
                <SelectItem value="Needs Review">Needs Review</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading documents...</p>
            </div>
          ) : filteredDocuments.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                {searchTerm || categoryFilter !== "all" || statusFilter !== "all"
                  ? "No documents match your filters"
                  : "No documents yet"}
              </p>
              <Button onClick={() => window.location.href = "/upload"}>
                Upload Your First Document
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDocuments.map((doc: any) => (
                <DocumentCard
                  key={doc.id}
                  id={doc.id}
                  name={doc.name}
                  type={doc.type}
                  category={doc.category}
                  status={doc.status}
                  created_at={doc.created_at}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};