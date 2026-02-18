"use client";

import { useQuery, useMutation } from "convex/react";
import { useState } from "react";
import { api } from "../../convex/_generated/api";
import { Layout } from "../components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, User, Bot, X, Check } from "lucide-react";
import { Id } from "../../convex/_generated/dataModel";

const statusColumns = [
  { id: "backlog", label: "Backlog", color: "text-muted-foreground" },
  { id: "todo", label: "To Do", color: "text-foreground" },
  { id: "in_progress", label: "In Progress", color: "text-blue-600" },
  { id: "done", label: "Done", color: "text-green-600" },
] as const;

export default function TasksPage() {
  const [addingTo, setAddingTo] = useState<typeof statusColumns[number]["id"] | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  
  const tasks = useQuery(api.tasks.list);
  const createTask = useMutation(api.tasks.create);
  const updateStatus = useMutation(api.tasks.updateStatus);
  const deleteTask = useMutation(api.tasks.remove);

  const handleAddTask = async () => {
    if (!newTaskTitle.trim() || !addingTo) return;
    
    await createTask({
      title: newTaskTitle.trim(),
      status: addingTo,
      assignee: "me",
    });
    
    setNewTaskTitle("");
    setAddingTo(null);
  };

  if (tasks === undefined) {
    return <Layout><div className="flex items-center justify-center min-h-[400px]">Loading tasks...</div></Layout>;
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold italic">Tasks</h1>
            <p className="text-muted-foreground">Track what we&apos;re working on 🍺</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
          {statusColumns.map((column) => (
            <div key={column.id} className="space-y-4 bg-muted/20 p-3 rounded-xl border border-border/50">
              <div className="flex items-center justify-between px-2">
                <h2 className={cn("text-xs font-bold uppercase tracking-widest", column.color)}>
                  {column.label}
                  <span className="ml-2 text-[10px] opacity-50 bg-muted px-1.5 py-0.5 rounded-full">
                    {tasks.filter(t => t.status === column.id).length}
                  </span>
                </h2>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 hover:bg-muted"
                  onClick={() => setAddingTo(addingTo === column.id ? null : column.id)}
                >
                  <Plus className={cn("h-4 w-4 transition-transform", addingTo === column.id && "rotate-45")} />
                </Button>
              </div>
              
              <div className="space-y-3">
                {addingTo === column.id && (
                  <Card className="border-primary/50 shadow-sm overflow-hidden">
                    <CardContent className="p-3 space-y-3">
                      <Input
                        autoFocus
                        placeholder="What needs doing?"
                        className="text-sm h-8 border-none focus-visible:ring-0 px-1"
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleAddTask();
                          if (e.key === "Escape") setAddingTo(null);
                        }}
                      />
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={() => setAddingTo(null)}>
                          <X className="h-3 w-3 mr-1" /> Cancel
                        </Button>
                        <Button size="sm" className="h-7 px-2 text-xs" onClick={handleAddTask}>
                          <Check className="h-3 w-3 mr-1" /> Add
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {tasks
                  .filter((t) => t.status === column.id)
                  .map((task) => (
                    <Card key={task._id} className="group relative hover:shadow-md transition-all border-border/50 hover:border-primary/20">
                      <CardContent className="p-4 pt-5">
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="font-medium text-sm leading-snug">{task.title}</h3>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity absolute top-1 right-1"
                            onClick={() => deleteTask({ id: task._id })}
                          >
                            <Trash2 className="h-3 w-3 text-destructive/70 hover:text-destructive" />
                          </Button>
                        </div>
                        
                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-muted/50 border border-border/30">
                            {task.assignee === "me" ? (
                              <User className="h-3 w-3 text-primary" />
                            ) : (
                              <Bot className="h-3 w-3 text-blue-500" />
                            )}
                            <span className="text-[10px] uppercase font-bold tracking-tighter">
                              {task.assignee}
                            </span>
                          </div>
                          
                          <select 
                            className="text-[10px] bg-transparent font-medium border-none cursor-pointer focus:ring-0 opacity-40 hover:opacity-100 transition-opacity"
                            value={task.status}
                            onChange={(e) => updateStatus({ 
                              id: task._id, 
                              status: e.target.value as any 
                            })}
                          >
                            {statusColumns.map(col => (
                              <option key={col.id} value={col.id}>{col.label}</option>
                            ))}
                          </select>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                {tasks.filter((t) => t.status === column.id).length === 0 && !addingTo && (
                  <div className="border rounded-lg border-dashed p-10 text-center bg-muted/10 opacity-40">
                    <p className="text-[10px] uppercase tracking-widest font-black">Empty</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
