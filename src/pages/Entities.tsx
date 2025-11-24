import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { EntityCard } from "@/components/entities/EntityCard";
import { Entity } from "@/entities";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Entities = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const { data: entities = [], isLoading } = useQuery({
    queryKey: ["allEntities"],
    queryFn: async () => {
      try {
        return await Entity.list("-created_at", 100);
      } catch (error) {
        console.error("Error fetching entities:", error);
        return [];
      }
    },
  });

  const filteredEntities = entities.filter((entity: any) => {
    const matchesSearch =
      entity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (entity.email && entity.email.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = typeFilter === "all" || entity.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />
      
      <main className="ml-64 pt-16">
        <div className="p-6 animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Entities</h1>
              <p className="text-muted-foreground">
                Manage people and businesses
              </p>
            </div>
          </div>

          <div className="mb-6">
            <img
              src="https://ellprnxjjzatijdxcogk.supabase.co/storage/v1/object/public/files/chat-generated-images/project-hf5oukfyl3wan2ywbmqrt/43d50dd6-1249-4ba6-a64f-5c5f130e09e5.png"
              alt="Business entities and organization structure visualization"
              className="w-full h-48 object-cover rounded-lg"
            />
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search entities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Person">Person</SelectItem>
                <SelectItem value="Business">Business</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading entities...</p>
            </div>
          ) : filteredEntities.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                {searchTerm || typeFilter !== "all"
                  ? "No entities match your filters"
                  : "No entities yet"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredEntities.map((entity: any) => (
                <EntityCard
                  key={entity.id}
                  id={entity.id}
                  name={entity.name}
                  type={entity.type}
                  email={entity.email}
                  compliance_status={entity.compliance_status}
                  risk_level={entity.risk_level}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};