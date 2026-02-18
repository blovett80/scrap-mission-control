"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Layout } from "../components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, User, Bot } from "lucide-react";
import { Id } from "../../convex/_generated/dataModel";

const statusColumns = [
  { id: "backlog", label: "Backlog", color: "text-muted-foreground" },
  { id: "todo", label: "To Do", color: "text-foreground" },
  { id: "in_progress", label: "In Progress", color: "text-blue-600" },
  { id: "done", label: "Done", color: "text-green-600" },
] as const;

export default function TasksPage() {
  const tasks = useQuery(api.tasks.list);
  const createTask = useMutation(api.tasks.create);
  const updateStatus = useMutation(api.tasks.updateStatus);
  const deleteTask = useMutation(api.tasks.remove);

  const handleAddTask = async (status: typeof statusColumns[number]["id"]) => {
    const title = window.prompt("Task title:");
    if (!title) return;
    
    await createTask({
      title,
      status,
      assignee: "me",
    });
  };

  if (tasks === undefined) {
    return <Layout><div>Loading tasks...</div></Layout>;
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Tasks</h1>
            <p className="text-muted-foreground">Track what we&apos;re working on</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statusColumns.map((column) => (
            <div key={column.id} className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <h2 className={cn("text-sm font-semibold uppercase tracking-wider", column.color)}>
                  {column.label}
                </h2>
                <Button variant="ghost" size="icon" onClick={() => handleAddTask(column.id)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-3">
                {tasks
                  .filter((t) => t.status === column.id)
                  .map((task) => (
                    <Card key={task._id} className="group relative hover:shadow-md transition-shadow">
                      <CardContent className="p-4 pt-6">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-medium text-sm leading-tight">{task.title}</h3>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => deleteTask({ id: task._id })}
                          >
                            <Trash2 className="h-3 w-3 text-destructive" />
                          </Button>
                        </div>
                        
                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            {task.assignee === "me" ? (
                              <User className="h-3 w-3" />
                            ) : (
                              <Bot className="h-3 w-3" />
                            )}
                            <span className="capitalize">{task.assignee}</span>
                          </div>
                          
                          <select 
                            className="text-[10px] bg-muted rounded px-1 py-0.5 border-none cursor-pointer"
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
                  
                {tasks.filter((t) => t.status === column.id).length === 0 && (
                  <div className="border rounded-lg border-dashed p-8 text-center bg-muted/30">
                    <p className="text-xs text-muted-foreground">No tasks</p>
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

// Helper to handle class names (copying from lib/utils)
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
