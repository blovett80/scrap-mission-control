"use client";

import { useQuery, useMutation } from "convex/react";
import { useState } from "react";
import { api } from "../../convex/_generated/api";
import { Layout } from "../components/Layout";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X, Check, Trash2, Pen } from "lucide-react";

const stages = [
  { id: "idea", label: "💡 Idea", color: "text-gray-600", bg: "bg-gray-100" },
  { id: "script", label: "📝 Script", color: "text-blue-600", bg: "bg-blue-50" },
  { id: "thumbnail", label: "🖼️ Thumbnail", color: "text-purple-600", bg: "bg-purple-50" },
  { id: "filming", label: "🎬 Filming", color: "text-orange-600", bg: "bg-orange-50" },
  { id: "published", label: "✅ Published", color: "text-green-600", bg: "bg-green-50" },
] as const;

export default function ContentPage() {
  const [addingTo, setAddingTo] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [editingItem, setEditingItem] = useState<any>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editScript, setEditScript] = useState("");
  
  const items = useQuery(api.content.list);
  const createItem = useMutation(api.content.create);
  const updateItem = useMutation(api.content.update);
  const moveItem = useMutation(api.content.moveStage);
  const deleteItem = useMutation(api.content.remove);

  const handleAdd = async () => {
    if (!newTitle.trim() || !addingTo) return;
    await createItem({ title: newTitle.trim(), stage: addingTo as any });
    setNewTitle("");
    setAddingTo(null);
  };

  const openEdit = (item: any) => {
    setEditingItem(item);
    setEditTitle(item.title);
    setEditScript(item.script || "");
  };

  const saveEdit = async () => {
    if (!editingItem) return;
    await updateItem({
      id: editingItem._id,
      title: editTitle,
      script: editScript,
    });
    setEditingItem(null);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this content item?")) {
      await deleteItem({ id: id as any });
    }
  };

  if (items === undefined) {
    return <Layout><div className="flex items-center justify-center min-h-[400px]">Loading content...</div></Layout>;
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold italic">Content Pipeline</h1>
          <p className="text-muted-foreground">From idea to published 🍺</p>
        </div>
        
        <div className="flex gap-4 overflow-x-auto pb-4">
          {stages.map((stage) => (
            <div key={stage.id} className={`min-w-[300px] flex-1 ${stage.bg} p-4 rounded-xl border border-border/30`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className={`text-sm font-bold ${stage.color}`}>
                  {stage.label}
                  <span className="ml-2 text-[10px] bg-white/50 px-2 py-0.5 rounded-full">
                    {items.filter((i: any) => i.stage === stage.id).length}
                  </span>
                </h2>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6" 
                  onClick={() => setAddingTo(addingTo === stage.id ? null : stage.id)}
                >
                  <Plus className={`h-4 w-4 transition-transform ${addingTo === stage.id ? "rotate-45" : ""}`} />
                </Button>
              </div>
              {items.filter((i: any) => i.stage === stage.id).length === 0 && !addingTo && (
                <div className="border-2 border-dashed border-border/30 rounded-lg p-8 text-center opacity-40">
                  <p className="text-[10px] uppercase tracking-widest font-bold">Empty</p>
                </div> 
              )}
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
