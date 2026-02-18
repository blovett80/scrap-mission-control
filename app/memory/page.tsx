"use client";

import { Layout } from "../components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function MemoryPage() {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Memory</h1>
          <p className="text-muted-foreground">Search and browse all memories</p>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search memories..." className="pl-10" />
        </div>
        
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Session Start</CardTitle>
              <p className="text-xs text-muted-foreground">2026-02-18</p>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Brian and I established identity and communication channels. Named myself Scrap, configured iMessage, and started building Mission Control.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
