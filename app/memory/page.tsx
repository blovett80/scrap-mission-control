"use client";

import { useEffect, useState, useMemo } from "react";
import { Layout } from "../components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Search, FileText, Calendar, ChevronRight, Plus, X, Edit, Save, Trash } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Memory {
  filename: string;
  title: string;
  preview: string;
  content?: string;
}

export default function MemoryPage() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState("");
  const [saving, setSaving] = useState(false);

  // Load memories from Jayden system (mind/ directory)
  useEffect(() => {
    fetchMemories();
  }, []);

  async function fetchMemories() {
    try {
      const res = await fetch("/api/memories");
      const data = await res.json();
      setMemories(data.memories || []);
    } catch (error) {
      console.error("Failed to load memories:", error);
    } finally {
      setLoading(false);
    }
  }

  async function loadMemory(memory: Memory) {
    try {
      const res = await fetch(`/api/memories?file=${encodeURIComponent(memory.filename)}`);
      const data = await res.json();
      setSelectedMemory({ ...memory, content: data.content });
      setEditContent(data.content);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to load memory:", error);
    }
  }

  async function saveMemory() {
    if (!selectedMemory) return;
    setSaving(true);
    try {
      const res = await fetch("/api/memories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: selectedMemory.filename,
          content: editContent,
        }),
      });
      if (res.ok) {
        setSelectedMemory({ ...selectedMemory, content: editContent });
        setIsEditing(false);
        // Refresh list
        fetchMemories();
      }
    } catch (error) {
      console.error("Failed to save:", error);
    } finally {
      setSaving(false);
    }
  }

  const filteredMemories = useMemo(() => {
    if (!searchQuery.trim()) return memories;
    const query = searchQuery.toLowerCase();
    return memories.filter((m) =>
      m.title.toLowerCase().includes(query) ||
      m.filename.toLowerCase().includes(query)
    );
  }, [memories, searchQuery]);

  // Group memories by directory
  const groupedMemories = useMemo(() => {
    const groups: Record<string, Memory[]> = {};
    filteredMemories.forEach((m) => {
      const dir = m.filename.includes("/")
        ? m.filename.split("/")[0]
        : "Core Files";
      if (!groups[dir]) groups[dir] = [];
      groups[dir].push(m);
    });
    return groups;
  }, [filteredMemories]);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          Loading Jayden Memory System...
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold italic">Memory</h1>
            <p className="text-muted-foreground">
              Jayden Memory System — Profile, Projects, Decisions, Logs
            </p>
          </div>
          <div className="text-sm text-muted-foreground">
            {memories.length} memory files
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search memories..."
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
              {searchQuery
                ? `Search Results (${filteredMemories.length})`
                : `All Memories (${memories.length})`}
            </h2>

            <ScrollArea className="h-[600px] pr-4">
              <div className="space-y-4">
                {Object.entries(groupedMemories).map(([group, groupMemories]) => (
                  <div key={group}>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70 px-1 mb-2">
                      {group}
                    </h3>
                    <div className="space-y-2">
                      {groupMemories.map((memory) => (
                        <Card
                          key={memory.filename}
                          className={`cursor-pointer transition-all hover:shadow-md ${
                            selectedMemory?.filename === memory.filename
                              ? "border-primary bg-primary/5"
                              : "border-border/50 hover:border-primary/30"
                          }`}
                          onClick={() => loadMemory(memory)}
                        >
                          <CardContent className="p-3">
                            <div className="flex items-start gap-2">
                              <div className="mt-0.5">
                                <FileText className="h-4 w-4 text-muted-foreground" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-sm truncate">
                                  {memory.title}
                                </h3>
                                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                  {memory.preview}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
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
            {selectedMemory ? (
              <Card className="h-[600px] flex flex-col">
                <CardHeader className="border-b pb-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl font-bold">
                        {selectedMemory.title}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                        <FileText className="h-4 w-4" />
                        {selectedMemory.filename}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {isEditing ? (
                        <>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={saveMemory}
                            disabled={saving}
                          >
                            <Save className="h-4 w-4 mr-1" />
                            {saving ? "Saving..." : "Save"}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setIsEditing(false);
                              setEditContent(selectedMemory.content || "");
                            }}
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsEditing(true)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 overflow-hidden p-0">
                  {isEditing ? (
                    <Textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="h-full w-full resize-none border-0 rounded-none p-6 font-mono text-sm leading-relaxed focus-visible:ring-0"
                      placeholder="Edit memory content..."
                    />
                  ) : (
                    <ScrollArea className="h-full px-6 py-4">
                      <div className="prose prose-sm max-w-none">
                        <div className="whitespace-pre-wrap font-mono text-sm leading-relaxed">
                          {selectedMemory.content || "Loading..."}
                        </div>
                      </div>
                    </ScrollArea>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card className="h-[600px] flex items-center justify-center border-dashed">
                <div className="text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    Select a memory to view
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-xs">
                    Browse the Jayden Memory System files from the sidebar
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
