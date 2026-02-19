"use client";

import { useQuery, useMutation } from "convex/react";
import { useState } from "react";
import { api } from "../../convex/_generated/api";
import { Layout } from "../components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Plus, Bot, Trash2, Circle } from "lucide-react";

export default function TeamPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [responsibilities, setResponsibilities] = useState("");
  const [status, setStatus] = useState<"active" | "idle">("active");
  const [avatar, setAvatar] = useState("");

  const agents = useQuery(api.agents.list);
  const createAgent = useMutation(api.agents.create);
  const removeAgent = useMutation(api.agents.remove);

  const handleCreate = async () => {
    if (!name.trim() || !role.trim()) return;

    const responsibilityList = responsibilities
      .split("\n")
      .map((r) => r.trim())
      .filter((r) => r.length > 0);

    await createAgent({
      name: name.trim(),
      role: role.trim(),
      responsibilities: responsibilityList,
      status,
      avatar: avatar.trim() || undefined,
    });

    // Reset form
    setName("");
    setRole("");
    setResponsibilities("");
    setStatus("active");
    setAvatar("");
    setDialogOpen(false);
  };

  if (!agents) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          Loading team...
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold italic">Team</h1>
            <p className="text-muted-foreground">
              Manage your digital workforce
            </p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Agent
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Agent</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Scrap"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input
                    id="role"
                    placeholder="e.g., General Assistant"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="responsibilities">
                    Responsibilities (one per line)
                  </Label>
                  <Textarea
                    id="responsibilities"
                    placeholder="Coding&#10;Research&#10;Task automation"
                    value={responsibilities}
                    onChange={(e) => setResponsibilities(e.target.value)}
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={status} onValueChange={(v: any) => setStatus(v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="idle">Idle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="avatar">Avatar (emoji or icon)</Label>
                  <Input
                    id="avatar"
                    placeholder="🍺"
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="ghost" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreate}>Create Agent</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {agents.map((agent) => (
            <Card key={agent._id} className="group relative">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-2xl border border-border">
                  {agent.avatar || <Bot className="h-6 w-6" />}
                </div>
                <div className="flex-1">
                  <CardTitle className="text-base">{agent.name}</CardTitle>
                  <p className="text-xs text-muted-foreground">{agent.role}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeAgent({ id: agent._id })}
                >
                  <Trash2 className="h-3 w-3 text-destructive/70 hover:text-destructive" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Circle
                    className={`h-2 w-2 rounded-full ${
                      agent.status === "active"
                        ? "fill-green-500 text-green-500"
                        : "fill-gray-400 text-gray-400"
                    }`}
                  />
                  <span className="text-sm text-muted-foreground capitalize">
                    {agent.status}
                  </span>
                </div>
                {agent.responsibilities.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Responsibilities
                    </p>
                    <ul className="text-xs text-muted-foreground space-y-0.5">
                      {agent.responsibilities.map((resp, idx) => (
                        <li key={idx}>• {resp}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          {agents.length === 0 && (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <Bot className="h-12 w-12 mb-3" />
                <p className="text-sm">No agents yet. Add your first one!</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
}
