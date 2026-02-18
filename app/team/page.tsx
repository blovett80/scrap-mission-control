"use client";

import { Layout } from "../components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Bot } from "lucide-react";

export default function TeamPage() {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Team</h1>
            <p className="text-muted-foreground">Manage your digital workforce</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Agent
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-2xl">
                🍺
              </div>
              <div>
                <CardTitle className="text-base">Scrap</CardTitle>
                <p className="text-xs text-muted-foreground">General Assistant</p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                <span className="text-sm text-muted-foreground">Active</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <Bot className="h-8 w-8 mb-2" />
              <p className="text-sm">Add your first subagent</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
