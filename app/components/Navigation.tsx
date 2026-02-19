"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  CheckSquare, 
  PenTool, 
  Calendar, 
  Brain, 
  Users, 
  Building,
  Utensils 
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/tasks", label: "Tasks", icon: CheckSquare },
  { href: "/content", label: "Content", icon: PenTool },
  { href: "/calendar", label: "Calendar", icon: Calendar },
  { href: "/memory", label: "Memory", icon: Brain },
  { href: "/team", label: "Team", icon: Users },
  { href: "/office", label: "Office", icon: Building },
  { href: "/meals", label: "Chef's Table", icon: Utensils },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="w-64 border-r border-white/[0.06] bg-[var(--sidebar)] min-h-screen p-5 flex flex-col">
      {/* Logo / Brand */}
      <div className="mb-10 px-3">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-white/10 flex items-center justify-center text-lg">
            🍺
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-foreground">Mission Control</h1>
            <p className="text-[10px] font-medium text-foreground/30 uppercase tracking-widest">Scrap</p>
          </div>
        </div>
      </div>
      
      {/* Nav Items */}
      <div className="space-y-1 flex-1">
        <p className="px-3 mb-3 text-[10px] font-bold uppercase tracking-[0.15em] text-foreground/20">Navigation</p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-200",
                isActive
                  ? "bg-foreground/10 text-foreground shadow-sm"
                  : "text-foreground/40 hover:bg-foreground/[0.05] hover:text-foreground/70"
              )}
            >
              <Icon className={cn("h-4 w-4 transition-colors duration-200", isActive ? "text-foreground" : "text-foreground/30")} />
              {item.label}
              {isActive && (
                <div className="ml-auto h-1.5 w-1.5 rounded-full bg-foreground/60" />
              )}
            </Link>
          );
        })}
      </div>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          </div>
          <div>
            <p className="text-xs font-medium text-foreground/70">Agent Online</p>
            <p className="text-[10px] text-foreground/30">Scrap • Ready</p>
          </div>
        </div>
      </div>
    </nav>
  );
}
