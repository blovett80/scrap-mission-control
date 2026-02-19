"use client";

import { useQuery, useMutation } from "convex/react";
import { useState } from "react";
import { api } from "../../convex/_generated/api";
import { Layout } from "../components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThumbsUp, ThumbsDown, Utensils, ChefHat } from "lucide-react";

const FAMILY = ["Roman", "Harlan", "Pam", "Brian"] as const;
const CHEFS = ["Robert", "Brian", "Pam", "Other"] as const;

export default function MealsPage() {
  const [newMeal, setNewMeal] = useState("");
  const [chef, setChef] = useState("Robert");
  const [ratings, setRatings] = useState<Record<string, "up" | "down" | null>>({
    Roman: null,
    Harlan: null,
    Pam: null,
    Brian: null,
  });

  const meals = useQuery(api.meals.list);
  const recentRatings = useQuery(api.meals.getRatings, { limit: 10 });
  const upsertMeal = useMutation(api.meals.upsertMeal);
  const addRating = useMutation(api.meals.addRating);

  const handleSubmit = async () => {
    if (!newMeal.trim()) return;

    const mealId = await upsertMeal({ name: newMeal.trim(), chef });
    await addRating({
      mealId,
      date: new Date().toISOString().split("T")[0],
      chef,
      ratings: {
        Roman: ratings.Roman || undefined,
        Harlan: ratings.Harlan || undefined,
        Pam: ratings.Pam || undefined,
        Brian: ratings.Brian || undefined,
      },
    });

    setNewMeal("");
    setRatings({ Roman: null, Harlan: null, Pam: null, Brian: null });
  };

  const toggleRating = (person: string, rating: "up" | "down") => {
    setRatings((prev) => ({
      ...prev,
      [person]: prev[person] === rating ? null : rating,
    }));
  };

  if (meals === undefined || recentRatings === undefined) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          Loading Chef&apos;s Table...
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold italic">Chef&apos;s Table</h1>
          <p className="text-muted-foreground">Family meal ratings 🍴</p>
        </div>

        {/* Add New Meal Form */}
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <ChefHat className="h-5 w-5" />
              Log Tonight&apos;s Dinner
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-tight text-muted-foreground">Meal Name</label>
                <Input
                  className="h-12 text-lg"
                  placeholder="What was for dinner?"
                  value={newMeal}
                  onChange={(e) => setNewMeal(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-tight text-muted-foreground">The Chef</label>
                <select
                  className="w-full h-12 rounded-md border border-input bg-background px-3 text-lg"
                  value={chef}
                  onChange={(e) => setChef(e.target.value)}
                >
                  {CHEFS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-sm font-bold uppercase tracking-tight text-muted-foreground">Family Ratings</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {FAMILY.map((person) => (
                  <div key={person} className="bg-muted/30 p-4 rounded-xl text-center space-y-3">
                    <p className="font-bold text-sm">{person}</p>
                    <div className="flex flex-col gap-2">
                      <Button
                        variant={ratings[person] === "up" ? "default" : "outline"}
                        className={ratings[person] === "up" ? "bg-green-600 hover:bg-green-700" : ""}
                        onClick={() => toggleRating(person, "up")}
                      >
                        <ThumbsUp className="h-4 w-4 mr-2" /> Up
                      </Button>
                      <Button
                        variant={ratings[person] === "down" ? "destructive" : "outline"}
                        onClick={() => toggleRating(person, "down")}
                      >
                        <ThumbsDown className="h-4 w-4 mr-2" /> Down
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Button
              size="lg"
              onClick={handleSubmit}
              disabled={!newMeal.trim()}
              className="w-full h-14 text-xl font-bold italic shadow-lg hover:shadow-xl transition-all"
            >
              <Utensils className="h-6 w-6 mr-2" />
              Save to History
            </Button>
          </CardContent>
        </Card>

        {/* History List */}
        <div className="space-y-4 pt-4">
          <h2 className="text-xl font-bold uppercase tracking-widest text-muted-foreground">Recent History</h2>
          {recentRatings.length === 0 ? (
            <div className="text-center py-12 bg-muted/10 border-2 border-dashed rounded-xl opacity-50">
              <p>No meals recorded yet. Log your first one above!</p>
            </div>
          ) : (
            recentRatings.map((rating) => {
              const meal = meals.find((m) => m._id === rating.mealId);
              return (
                <Card key={rating._id} className="overflow-hidden">
                  <CardHeader className="py-4 bg-muted/20 flex flex-row items-center justify-between border-b">
                    <div>
                      <CardTitle className="text-xl flex items-center gap-2">
                        <Utensils className="h-5 w-5 text-primary" />
                        {meal?.name}
                      </CardTitle>
                      <p className="text-xs text-muted-foreground mt-1">
                        👨‍🍳 Chef: <span className="font-bold text-foreground">{rating.chef || "Unknown"}</span> • {rating.date}
                      </p>
                    </div>
                  </CardHeader>
                  <CardContent className="py-6">
                    <div className="grid grid-cols-4 gap-4 text-center">
                      {FAMILY.map((person) => (
                        <div key={person} className="space-y-2">
                          <p className="text-[10px] font-black uppercase text-muted-foreground">
                            {person}
                          </p>
                          <div className="flex justify-center">
                            {(rating.ratings as any)[person] === "up" ? (
                              <div className="bg-green-100 p-2 rounded-full">
                                <ThumbsUp className="h-6 w-6 text-green-600" />
                              </div>
                            ) : (rating.ratings as any)[person] === "down" ? (
                              <div className="bg-red-100 p-2 rounded-full">
                                <ThumbsDown className="h-6 w-6 text-red-600" />
                              </div>
                            ) : (
                              <div className="bg-muted p-2 rounded-full opacity-30">
                                <span className="text-xs font-bold">—</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </Layout>
  );
}
