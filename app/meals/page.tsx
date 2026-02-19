"use client";

import { useQuery, useMutation } from "convex/react";
import { useState } from "react";
import { api } from "../../convex/_generated/api";
import { Layout } from "../components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  ThumbsUp, 
  ThumbsDown, 
  Utensils, 
  ChefHat, 
  Trash2,
  Check,
  Trash,
  ArrowUpDown,
  MessageSquare
} from "lucide-react";

const FAMILY = ["Roman", "Harlan", "Pam", "Brian"] as const;
const CHEFS = ["Robert", "Brian", "Pam", "Other"] as const;

const SORT_OPTIONS = [
  { value: "date-desc", label: "Most Recent First" },
  { value: "date-asc", label: "Oldest First" },
  { value: "name-asc", label: "Meal Name (A-Z)" },
  { value: "name-desc", label: "Meal Name (Z-A)" },
] as const;

export default function MealsPage() {
  const [newMeal, setNewMeal] = useState("");
  const [chef, setChef] = useState("Robert");
  const [sortBy, setSortBy] = useState<typeof SORT_OPTIONS[number]["value"]>("date-desc");
  const [ratings, setRatings] = useState<Record<string, "up" | "down" | null>>({
    Roman: null,
    Harlan: null,
    Pam: null,
    Brian: null,
  });
  const [comments, setComments] = useState("");

  const meals = useQuery(api.meals.list);
  const recentRatings = useQuery(api.meals.getRatings, { limit: 10 });
  const upsertMeal = useMutation(api.meals.upsertMeal);
  const addRating = useMutation(api.meals.addRating);
  const deleteRating = useMutation(api.meals.removeRating);
  const removeMeal = useMutation(api.meals.removeMeal);

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
      comments: comments.trim() || undefined,
    });

    setNewMeal("");
    setRatings({ Roman: null, Harlan: null, Pam: null, Brian: null });
    setComments("");
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

  // Sort ratings based on sortBy state
  const sortedRatings = [...recentRatings].sort((a, b) => {
    const mealA = meals.find((m) => m._id === a.mealId);
    const mealB = meals.find((m) => m._id === b.mealId);

    switch (sortBy) {
      case "date-desc":
        return b.date.localeCompare(a.date);
      case "date-asc":
        return a.date.localeCompare(b.date);
      case "name-asc":
        return (mealA?.name || "").localeCompare(mealB?.name || "");
      case "name-desc":
        return (mealB?.name || "").localeCompare(mealA?.name || "");
      default:
        return 0;
    }
  });

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold italic">Chef&apos;s Table</h1>
          <p className="text-muted-foreground">Family meal ratings 🍴</p>
        </div>

        {/* Add New Meal Form */}
        <Card className="border-2 border-primary/20 bg-card/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <ChefHat className="h-5 w-5 text-primary" />
              Log Tonight&apos;s Dinner
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Meal Name</label>
                <Input
                  className="h-12 text-lg bg-background"
                  placeholder="What was served?"
                  value={newMeal}
                  onChange={(e) => setNewMeal(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">The Chef</label>
                <select
                  className="w-full h-12 rounded-md border border-input bg-background px-3 text-lg focus:ring-2 focus:ring-primary/20 outline-none"
                  value={chef}
                  onChange={(e) => setChef(e.target.value)}
                >
                  {CHEFS.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Family Ratings</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {FAMILY.map((person) => (
                  <div key={person} className="bg-card border p-4 rounded-xl text-center space-y-3 shadow-sm">
                    <p className="font-bold text-sm tracking-tight">{person}</p>
                    <div className="flex justify-center gap-2">
                      <Button
                        variant={ratings[person] === "up" ? "default" : "outline"}
                        className={`h-12 w-12 rounded-full ${ratings[person] === "up" ? "bg-green-600 hover:bg-green-700 shadow-md" : ""}`}
                        onClick={() => toggleRating(person, "up")}
                      >
                        <ThumbsUp className="h-5 w-5" />
                      </Button>
                      <Button
                        variant={ratings[person] === "down" ? "destructive" : "outline"}
                        className={`h-12 w-12 rounded-full ${ratings[person] === "down" ? "bg-red-600 hover:bg-red-700 shadow-md" : ""}`}
                        onClick={() => toggleRating(person, "down")}
                      >
                        <ThumbsDown className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Notes / Comments</label>
              <Input
                className="h-12 bg-background"
                placeholder="Any thoughts on the meal?"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
              />
            </div>

            <Button
              size="lg"
              onClick={handleSubmit}
              disabled={!newMeal.trim()}
              className="w-full h-16 text-xl font-black uppercase tracking-tighter italic shadow-xl hover:scale-[1.01] transition-all active:scale-95"
            >
              <Utensils className="h-6 w-6 mr-3" />
              Save Tonight&apos;s Rating
            </Button>
          </CardContent>
        </Card>

        {/* History List */}
        <div className="space-y-4 pt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black uppercase tracking-tighter text-muted-foreground/50">Recent History</h2>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="text-sm bg-transparent border-none cursor-pointer focus:ring-0 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div className="h-px w-16 bg-border" />
            </div>
          </div>
          
          {sortedRatings.length === 0 ? (
            <div className="text-center py-16 bg-muted/5 border-2 border-dashed rounded-2xl opacity-30">
              <p className="font-medium">No meals recorded yet.</p>
            </div>
          ) : (
            sortedRatings.map((rating) => {
              const meal = meals.find((m) => m._id === rating.mealId);
              return (
                <Card key={rating._id} className="overflow-hidden group hover:border-primary/30 transition-colors shadow-sm">
                  <CardHeader className="py-4 bg-muted/30 flex flex-row items-center justify-between border-b">
                    <div>
                      <CardTitle className="text-xl font-bold flex items-center gap-2">
                        <Utensils className="h-5 w-5 text-primary/60" />
                        {meal?.name}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full uppercase">
                          👨‍🍳 {rating.chef || "Unknown"}
                        </span>
                        <span className="text-[10px] font-bold bg-muted px-2 py-0.5 rounded-full uppercase text-muted-foreground">
                          📅 {rating.date}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10"
                        title="Delete this specific rating entry"
                        onClick={() => deleteRating({ id: rating._id })}
                      >
                        <Trash2 className="h-4 w-4 text-destructive/50 hover:text-destructive" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/20"
                        title="Delete entire meal and ALL its history"
                        onClick={() => {
                          if (confirm(`Delete entire meal "${meal?.name}" and all its history?`)) {
                            removeMeal({ id: rating.mealId });
                          }
                        }}
                      >
                        <Trash className="h-4 w-4 text-destructive/80 hover:text-destructive" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="py-6">
                    <div className="grid grid-cols-4 gap-4 text-center">
                      {FAMILY.map((person) => (
                        <div key={person} className="space-y-2">
                          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                            {person}
                          </p>
                          <div className="flex justify-center">
                            {(rating.ratings as any)[person] === "up" ? (
                              <div className="bg-green-500/10 p-2.5 rounded-full ring-1 ring-green-500/20">
                                <ThumbsUp className="h-6 w-6 text-green-600" />
                              </div>
                            ) : (rating.ratings as any)[person] === "down" ? (
                              <div className="bg-red-500/10 p-2.5 rounded-full ring-1 ring-red-500/20">
                                <ThumbsDown className="h-6 w-6 text-red-600" />
                              </div>
                            ) : (
                              <div className="bg-muted p-2.5 rounded-full opacity-20 ring-1 ring-border">
                                <Check className="h-6 w-6" />
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    {rating.comments && (
                      <div className="mt-6 p-3 bg-primary/5 border border-primary/10 rounded-lg flex items-start gap-3">
                        <MessageSquare className="h-4 w-4 text-primary/60 mt-0.5" />
                        <p className="text-sm text-foreground/80 italic italic-serif leading-relaxed">
                          &ldquo;{rating.comments}&rdquo;
                        </p>
                      </div>
                    )}
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
