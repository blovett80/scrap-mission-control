"use client";

import { Layout } from "../components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Computer } from "lucide-react";

export default function OfficePage() {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Office</h1>
          <p className="text-muted-foreground">Visual view of your team at work</p>
        </div>
        
        <Card className="min-h-[500px] relative bg-muted/50">
          <CardContent className="p-8">
            <div className="grid grid-cols-3 gap-8">
              {/* Workstation 1 */}
              <div className="flex flex-col items-center gap-2">
                <div className="h-20 w-20 rounded-full bg-primary flex items-center justify-center text-3xl">
                  🍺
                </div>
                <div className="w-32 h-24 bg-card rounded-lg border flex items-center justify-center">
                  <Computer className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="text-center">
                  <p className="font-medium">Scrap</p>
                  <p className="text-xs text-green-600">Working</p>
                </div>
              </div>
              
              {/* Empty workstations */}
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-2 opacity-30">
                  <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
                    <span className="text-3xl">?</span>
                  </div>
                  <div className="w-32 h-24 bg-card rounded-lg border flex items-center justify-center">
                    <Computer className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div className="text-center">
                    <p className="font-medium">Empty</p>
                    <p className="text-xs text-muted-foreground">Available</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
