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
  MessageSquare,
  Trophy,
  Star
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
  const recentRatings = useQuery(api.meals.getRatings, { limit: 20 });
  const topMeals = useQuery(api.meals.getTopMeals);
  
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

  if (meals === undefined || recentRatings === undefined || topMeals === undefined) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-vh-50">
          Loading Chef&apos;s Table...
        </div>
      </Layout>
    );
  }

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
      <div className="space-y-6 max-w-5xl mx-auto pb-12">
        <div>
          <h1 className="text-4xl font-black italic tracking-tighter">CHEF&apos;S TABLE</h1>
          <p className="text-muted-foreground font-medium">Family meal ratings & culinary history 🍴</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-6">
            {/* Add New Meal Form */}
            <Card className="border-2 border-primary/20 bg-card/50 shadow-xl overflow-hidden">
              <div className="bg-primary/5 h-1.5 w-full" />
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2 font-black uppercase tracking-tight">
                  <ChefHat className="h-6 w-6 text-primary" />
                  Log Tonight&apos;s Dinner
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/80 flex items-center gap-1.5">
                      <Utensils className="h-3 w-3" /> Meal Name
                    </label>
                    <Input
                      className="h-12 text-lg bg-background border-2 focus-visible:ring-primary/20"
                      placeholder="e.g. Grandma's Lasagna"
                      value={newMeal}
                      onChange={(e) => setNewMeal(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/80 flex items-center gap-1.5">
                      <ChefHat className="h-3 w-3" /> The Chef
                    </label>
                    <select
                      className="w-full h-12 rounded-md border-2 border-input bg-background px-3 text-lg focus:ring-2 focus:ring-primary/20 outline-none transition-all"
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
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/80">Family Ratings</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {FAMILY.map((person) => (
                      <div key={person} className="bg-card/50 border-2 p-4 rounded-xl text-center space-y-3 shadow-sm transition-all hover:bg-card">
                        <p className="font-black text-xs tracking-tight uppercase text-muted-foreground">{person}</p>
                        <div className="flex justify-center gap-2">
                          <Button
                            variant={ratings[person] === "up" ? "default" : "outline"}
                            className={`h-11 w-11 rounded-full p-0 flex items-center justify-center transition-all ${ratings[person] === "up" ? "bg-green-600 hover:bg-green-700 shadow-md scale-110" : "hover:text-green-600 hover:border-green-600/30"}`}
                            onClick={() => toggleRating(person, "up")}
                          >
                            <ThumbsUp className="h-5 w-5" />
                          </Button>
                          <Button
                            variant={ratings[person] === "down" ? "destructive" : "outline"}
                            className={`h-11 w-11 rounded-full p-0 flex items-center justify-center transition-all ${ratings[person] === "down" ? "bg-red-600 hover:bg-red-700 shadow-md scale-110" : "hover:text-red-600 hover:border-red-600/30"}`}
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
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/80 flex items-center gap-1.5">
                    <MessageSquare className="h-3 w-3" /> Notes / Comments
                  </label>
                  <Input
                    className="h-12 bg-background border-2 focus-visible:ring-primary/20"
                    placeholder="Was it spicy? Too salty? Best ever?"
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                  />
                </div>

                <Button
                  size="lg"
                  onClick={handleSubmit}
                  disabled={!newMeal.trim()}
                  className="w-full h-16 text-xl font-black uppercase tracking-tighter italic shadow-xl hover:translate-y-[-2px] hover:shadow-primary/20 transition-all active:translate-y-0"
                >
                  <Utensils className="h-6 w-6 mr-3" />
                  Log This Creation
                </Button>
              </CardContent>
            </Card>

            {/* History List */}
            <div className="space-y-4 pt-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black uppercase tracking-tighter text-muted-foreground/40">The Archives</h2>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 group">
                    <ArrowUpDown className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="text-xs font-bold bg-transparent border-none cursor-pointer focus:ring-0 text-muted-foreground hover:text-foreground transition-colors uppercase tracking-widest"
                    >
                      {SORT_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="h-px w-12 bg-border" />
                </div>
              </div>
              
              <div className="space-y-4">
                {sortedRatings.length === 0 ? (
                  <div className="text-center py-20 bg-muted/5 border-4 border-dashed rounded-3xl opacity-20">
                    <Utensils className="h-12 w-12 mx-auto mb-4" />
                    <p className="text-xl font-bold italic tracking-tight">Gastronomically empty...</p>
                  </div>
                ) : (
                  sortedRatings.map((rating) => {
                    const meal = meals.find((m) => m._id === rating.mealId);
                    return (
                      <Card key={rating._id} className="overflow-hidden group hover:border-primary/40 transition-all shadow-md hover:shadow-lg border-2">
                        <CardHeader className="py-4 bg-muted/20 flex flex-row items-center justify-between border-b-2">
                          <div className="space-y-1">
                            <CardTitle className="text-2xl font-black flex items-center gap-2 tracking-tight">
                              {meal?.name}
                            </CardTitle>
                            <div className="flex items-center gap-3">
                              <span className="flex items-center gap-1 text-[10px] font-black bg-primary/10 text-primary px-2 py-0.5 rounded uppercase tracking-wider">
                                <ChefHat className="h-3 w-3" /> {rating.chef || "Shadow Chef"}
                              </span>
                              <span className="text-[10px] font-black bg-muted px-2 py-0.5 rounded uppercase tracking-wider text-muted-foreground/80">
                                {new Date(rating.date + "T00:00:00").toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-10 w-10 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 rounded-full"
                              title="Delete entry"
                              onClick={() => {
                                if (confirm("Delete this specific entry?")) {
                                  deleteRating({ id: rating._id });
                                }
                              }}
                            >
                              <Trash2 className="h-5 w-5 text-destructive/40 hover:text-destructive" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-10 w-10 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/20 rounded-full"
                              title="Delete meal history"
                              onClick={() => {
                                if (confirm(`Purge all history for "${meal?.name}"?`)) {
                                  removeMeal({ id: rating.mealId });
                                }
                              }}
                            >
                              <Trash className="h-5 w-5 text-destructive/80 hover:text-destructive" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="py-8">
                          <div className="grid grid-cols-4 gap-4">
                            {FAMILY.map((person) => (
                              <div key={person} className="space-y-3 text-center">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">
                                  {person}
                                </p>
                                <div className="flex justify-center">
                                  {(rating.ratings as any)[person] === "up" ? (
                                    <div className="bg-green-500/10 p-3 rounded-full ring-2 ring-green-500/20 shadow-inner">
                                      <ThumbsUp className="h-7 w-7 text-green-600" />
                                    </div>
                                  ) : (rating.ratings as any)[person] === "down" ? (
                                    <div className="bg-red-500/10 p-3 rounded-full ring-2 ring-red-500/20 shadow-inner">
                                      <ThumbsDown className="h-7 w-7 text-red-600" />
                                    </div>
                                  ) : (
                                    <div className="bg-muted p-3 rounded-full opacity-10 ring-2 ring-border">
                                      <Check className="h-7 w-7" />
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                          {rating.comments && (
                            <div className="mt-8 relative pt-6">
                              <div className="absolute top-0 left-0 h-0.5 w-12 bg-primary/20" />
                              <p className="text-base text-foreground/80 italic font-medium leading-relaxed pl-2 border-l-4 border-primary/20">
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
          </div>

          {/* Sidebar Stats */}
          <div className="space-y-8">
            <Card className="border-4 border-yellow-500/20 bg-yellow-500/[0.02] shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12 scale-150">
                <Trophy className="h-32 w-32" />
              </div>
              <CardHeader>
                <CardTitle className="text-xl font-black uppercase tracking-tight flex items-center gap-2 italic">
                  <Trophy className="h-6 w-6 text-yellow-500" />
                  Family Favorites
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 relative">
                {topMeals.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic">No data yet...</p>
                ) : (
                  topMeals.map((meal, i) => (
                    <div key={meal._id} className="group">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span className={`flex items-center justify-center h-8 w-8 rounded-full text-sm font-black italic ${i === 0 ? 'bg-yellow-500 text-black' : 'bg-muted'}`}>
                            #{i + 1}
                          </span>
                          <p className="font-black tracking-tight text-lg group-hover:text-primary transition-colors italic">
                            {meal.name}
                          </p>
                        </div>
                        {i === 0 && <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />}
                      </div>
                      <div className="space-y-1 pl-11">
                        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-1000 ${i === 0 ? 'bg-yellow-500' : 'bg-primary'}`} 
                            style={{ width: `${meal.approvalRating}%` }}
                          />
                        </div>
                        <div className="flex justify-between items-center px-0.5">
                          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                            {meal.totalVotes} Votes • {Math.round(meal.approvalRating)}% Approval
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            <Card className="border-2 border-muted bg-card/50">
              <CardHeader>
                <CardTitle className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground">Kitchen Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-end">
                  <p className="text-xs font-bold text-muted-foreground">Unique Dishes</p>
                  <p className="text-2xl font-black italic">{meals.length}</p>
                </div>
                <div className="flex justify-between items-end">
                  <p className="text-xs font-bold text-muted-foreground">Ratings Logged</p>
                  <p className="text-2xl font-black italic text-primary">{recentRatings.length}</p>
                </div>
                <div className="h-px bg-border my-2" />
                <p className="text-[11px] font-medium italic leading-relaxed text-muted-foreground/80">
                  Data reflects recorded history since initiative launch. Rankings favor high approval over volume.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
