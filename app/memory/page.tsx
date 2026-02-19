"use client";

import { useQuery, useMutation } from "convex/react";
import { useState, useMemo } from "react";
import { api } from "../../convex/_generated/api";
import { Layout } from "../components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, FileText, Calendar, ChevronRight, Plus, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function MemoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMemory, setSelectedMemory] = useState<string | null>(null);
  
  const memories = useQuery(api.memories.list);
  
  const filteredMemories = useMemo(() => {
    if (!memories) return [];
    if (!searchQuery.trim()) return memories;
    
    const query = searchQuery.toLowerCase();
    return memories.filter(m => 
      m.title.toLowerCase().includes(query) ||
      m.content.toLowerCase().includes(query) ||
      m.date.includes(query)
    );
  }, [memories, searchQuery]);
  
  const selectedMemoryData = useMemo(() => {
    if (!selectedMemory || !memories) return null;
    return memories.find(m => m._id === selectedMemory) || null;
  }, [selectedMemory, memories]);

  if (!memories) {
    return <Layout><div className="flex items-center justify-center min-h-[400px]">Loading memories...</div></Layout>;
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold italic">Memory</h1>
            <p className="text-muted-foreground">Browse and search all memories</p>
          </div>
          <div className="text-sm text-muted-foreground">
            {memories.length} memories stored
          </div>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search memories by title, content, or date..." 
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute right-2 top-1/2 -translate-y-1/2 h-5 w-5"
              onClick={() => setSearchQuery("")}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
        
        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Memory List */}
          <div className="lg:col-span-1 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-1">
              {searchQuery ? `Search Results (${filteredMemories.length})` : `All Memories (${memories.length})`}
            </h2>
            
            <ScrollArea className="h-[600px] pr-4">
              <div className="space-y-3">
                {filteredMemories.map((memory) => (
                  <Card 
                    key={memory._id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedMemory === memory._id 
                        ? "border-primary bg-primary/5" 
                        : "border-border/50 hover:border-primary/30"
                    }`}
                    onClick={() => setSelectedMemory(memory._id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm truncate">{memory.title}</h3>
                          <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {memory.date}
                          </div>
                          <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                            {memory.content.slice(0, 120)}...
                          </p>
                        </div>
                        <ChevronRight className={`h-4 w-4 text-muted-foreground transition-transform ${
                          selectedMemory === memory._id ? "rotate-90" : ""
                        }`} />
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {filteredMemories.length === 0 && (
                  <div className="text-center py-12 border-2 border-dashed rounded-lg">
                    <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">
                      {searchQuery ? "No memories found" : "No memories yet"}
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
          
          {/* Memory Detail */}
          <div className="lg:col-span-2">
            {selectedMemoryData ? (
              <Card className="h-[600px] flex flex-col">
                <CardHeader className="border-b pb-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl font-bold">{selectedMemoryData.title}</CardTitle>
                      <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {selectedMemoryData.date}
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => setSelectedMemory(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 overflow-hidden">
                  <ScrollArea className="h-full pr-4">
                    <div className="prose prose-sm max-w-none pt-4">
                      <div className="whitespace-pre-wrap font-mono text-sm leading-relaxed">
                        {selectedMemoryData.content}
                      </div>
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            ) : (
              <Card className="h-[600px] flex items-center justify-center border-dashed">
                <div className="text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Select a memory to view</h3>
                  <p className="text-sm text-muted-foreground max-w-xs">
                    Click on any memory from the list to read its full contents
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
