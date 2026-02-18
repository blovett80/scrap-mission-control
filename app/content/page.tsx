"use client";

import { Layout } from "../components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const stages = [
  { id: "idea", label: "Idea", color: "text-gray-600" },
  { id: "script", label: "Script", color: "text-blue-600" },
  { id: "thumbnail", label: "Thumbnail", color: "text-purple-600" },
  { id: "filming", label: "Filming", color: "text-orange-600" },
  { id: "published", label: "Published", color: "text-green-600" },
];

export default function ContentPage() {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Content Pipeline</h1>
            <p className="text-muted-foreground">Manage content creation workflow</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Idea
          </Button>
        </div>
        
        <div className="flex gap-4 overflow-x-auto pb-4">
          {stages.map((stage) => (
            <Card key={stage.id} className="min-w-[280px] flex-1">
              <CardHeader className="pb-3">
                <CardTitle className={`text-sm font-medium ${stage.color}`}>
                  {stage.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">No items</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}
