"use client";

import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { Layout } from "./components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckSquare, PenTool, Calendar as CalendarIcon, Brain, Users, Building, ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  const tasks = useQuery(api.tasks.list);
  const content = useQuery(api.content.list);
  const scheduled = useQuery(api.calendar.list);
  const memories = useQuery(api.memories.list);

  // Safely calculate counts with fallbacks
  const activeTasks = tasks?.filter(t => t.status === "in_progress").length || 0;
  const totalTasks = tasks?.length || 0;
  const contentItems = content?.length || 0;
  const upcomingScheduled = scheduled?.filter(s => !s.completed && s.scheduledAt > Date.now()).length || 0;
  const totalMemories = memories?.length || 0;

  const stats = [
    {
      label: "Tasks",
      value: activeTasks,
      subtext: `${totalTasks} total`,
      icon: CheckSquare,
      color: "text-[oklch(0.65_0.25_260)]", // Chart 1
      href: "/tasks",
      bgColor: "bg-[oklch(0.65_0.25_260)]/10"
    },
    {
      label: "Content",
      value: contentItems,
      subtext: "In pipeline",
      icon: PenTool,
      color: "text-[oklch(0.7_0.2_160)]", // Chart 2
      href: "/content",
      bgColor: "bg-[oklch(0.7_0.2_160)]/10"
    },
    {
      label: "Calendar",
      value: upcomingScheduled,
      subtext: "Upcoming",
      icon: CalendarIcon,
      color: "text-[oklch(0.75_0.2_60)]", // Chart 3
      href: "/calendar",
      bgColor: "bg-[oklch(0.75_0.2_60)]/10"
    },
    {
      label: "Memory",
      value: totalMemories,
      subtext: "Stored files",
      icon: Brain,
      color: "text-[oklch(0.65_0.25_320)]", // Chart 4
      href: "/memory",
      bgColor: "bg-[oklch(0.65_0.25_320)]/10"
    },
    {
      label: "Team",
      value: "1",
      subtext: "Active agents",
      icon: Users,
      color: "text-[oklch(0.7_0.2_20)]", // Chart 5
      href: "/team",
      bgColor: "bg-[oklch(0.7_0.2_20)]/10"
    },
    {
      label: "Office",
      value: "🍺",
      subtext: "Scrap active",
      icon: Building,
      color: "text-foreground", // Changed from text-white
      href: "/office",
      bgColor: "bg-foreground/10" // Changed from bg-white/10
    }
  ];

  return (
    <Layout>
      <div className="space-y-8 max-w-7xl mx-auto">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
            Mission Control
            <span className="text-sm font-medium px-3 py-1 rounded-full bg-foreground/10 text-foreground/60 tracking-normal">
              v2.0
            </span>
          </h1>
          <p className="text-muted-foreground text-lg">System status: All systems operational.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <Link href={stat.href} key={i} className="group">
                <Card className="h-full border-0 bg-white/[0.03] hover:bg-white/[0.06] transition-all duration-300 hover:translate-y-[-2px] overflow-hidden relative">
                  <div className={cn("absolute top-0 left-0 w-1 h-full", stat.color.replace("text-", "bg-"))} />
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                      {stat.label}
                    </CardTitle>
                    <div className={cn("p-2 rounded-lg transition-colors", stat.bgColor)}>
                      <Icon className={cn("h-4 w-4", stat.color)} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold text-foreground tracking-tight mb-1">{stat.value}</div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground font-medium">
                        {stat.subtext}
                      </p>
                      <ArrowRight className="h-4 w-4 text-white/0 group-hover:text-white/50 -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>

        {tasks && tasks.filter(t => t.status === "in_progress").length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-foreground tracking-tight flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-[oklch(0.65_0.25_260)] animate-pulse" />
              Active Work
            </h2>
            <div className="grid gap-4">
              {tasks.filter(t => t.status === "in_progress").map(task => (
                <div 
                  key={task._id} 
                  className="group flex items-center gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-all duration-200"
                >
                  <div className="h-10 w-10 rounded-full bg-[oklch(0.65_0.25_260)]/20 flex items-center justify-center shrink-0">
                    <CheckSquare className="h-5 w-5 text-[oklch(0.65_0.25_260)]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-medium text-foreground truncate group-hover:text-[oklch(0.65_0.25_260)] transition-colors">
                      {task.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-white/5 px-2 py-0.5 rounded">
                        {task.assignee}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        Started {new Date(task.updatedAt || task.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                  <div className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="text-[10px] font-medium text-[oklch(0.65_0.25_260)] bg-[oklch(0.65_0.25_260)]/10 px-3 py-1 rounded-full animate-pulse">
                      Processing
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
