"use client";

import { useState, useEffect } from "react";
import { Layout } from "../components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, FileText, Calendar } from "lucide-react";

interface Memory {
  filename: string;
  title: string;
  preview: string;
}

export default function MemoryPage() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<{ content: string; filename: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMemories();
  }, [search]);

  const fetchMemories = async () => {
    try {
      const url = search ? `/api/memories?q=${encodeURIComponent(search)}` : "/api/memories";
      const res = await fetch(url);
      const data = await res.json();
      setMemories(data.memories || []);
    } catch (error) {
      console.error("Failed to fetch memories:", error);
    } finally {
      setLoading(false);
    }
  };

  const openMemory = async (filename: string) => {
    try {
      const res = await fetch(`/api/memories?file=${encodeURIComponent(filename)}`);
      const data = await res.json();
      setSelected(data);
    } catch (error) {
      console.error("Failed to load memory:", error);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold italic">Memory</h1>
          <p className="text-muted-foreground">Search and browse all memories 🧠</p>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search memories..." 
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Loading memories...</div>
        ) : memories.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            {search ? "No memories found matching your search" : "No memories yet"}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {memories.map((memory) => (
              <Card 
                key={memory.filename} 
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => openMemory(memory.filename)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <CardTitle className="text-base line-clamp-1">{memory.title}</CardTitle>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {memory.filename.replace(".md", "")}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {memory.preview}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">{selected?.filename.replace(".md", "")}</DialogTitle>
          </DialogHeader>
          <div className="prose prose-sm dark:prose-invert max-w-none py-4">
            <pre className="whitespace-pre-wrap font-sans text-sm">
              {selected?.content}
            </pre>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
