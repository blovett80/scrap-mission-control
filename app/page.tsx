"use client";

import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { Layout } from "./components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckSquare, PenTool, Calendar as CalendarIcon, Brain, Users, Building } from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
  const tasks = useQuery(api.tasks.list);
  const content = useQuery(api.content.list);
  const scheduled = useQuery(api.calendar.list);
  const memories = useQuery(api.memories.list);

  const activeTasks = tasks?.filter(t => t.status === "in_progress").length || 0;
  const totalTasks = tasks?.length || 0;
  const contentItems = content?.length || 0;
  const upcomingScheduled = scheduled?.filter(s => !s.completed && s.scheduledAt > Date.now()).length || 0;
  const totalMemories = memories?.length || 0;

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold italic">Mission Control</h1>
          <p className="text-muted-foreground">Your command center 🍺</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link href="/tasks">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-blue-500">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Tasks</CardTitle>
                <CheckSquare className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{activeTasks}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {activeTasks} in progress • {totalTasks} total
                </p>
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/content">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-purple-500">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Content Pipeline</CardTitle>
                <PenTool className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{contentItems}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Items in pipeline
                </p>
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/calendar">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-orange-500">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Calendar</CardTitle>
                <CalendarIcon className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{upcomingScheduled}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Upcoming scheduled tasks
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/memory">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-green-500">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Memory</CardTitle>
                <Brain className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{totalMemories}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Stored memories
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/team">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-cyan-500">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Team</CardTitle>
                <Users className="h-4 w-4 text-cyan-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">1</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Active agents
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/office">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-pink-500">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Office</CardTitle>
                <Building className="h-4 w-4 text-pink-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">🍺</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Scrap working
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {tasks && tasks.filter(t => t.status === "in_progress").length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Active Work</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {tasks.filter(t => t.status === "in_progress").map(task => (
                  <div key={task._id} className="flex items-center gap-3 p-2 bg-muted/50 rounded-md">
                    <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                    <span className="text-sm font-medium">{task.title}</span>
                    <span className="text-xs text-muted-foreground ml-auto capitalize">{task.assignee}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
