"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Layout } from "../components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThumbsUp, ThumbsDown, Utensils } from "lucide-react";

export default function MealsPage() {
  const meals = useQuery(api.meals.list);
  const recentRatings = useQuery(api.meals.getRatings, { limit: 10 });

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold italic">Chef&apos;s Table</h1>
          <p className="text-muted-foreground">Family meal ratings 🍴</p>
        </div>

        <div className="grid gap-4">
          <h2 className="text-xl font-bold">Recent Ratings</h2>
          {recentRatings?.map((rating) => {
             const meal = meals?.find(m => m._id === rating.mealId);
             return (
               <Card key={rating._id}>
                 <CardHeader className="py-3 items-center flex flex-row justify-between">
                   <CardTitle className="text-lg flex items-center gap-2">
                     <Utensils className="h-4 w-4" />
                     {meal?.name}
                   </CardTitle>
                   <span className="text-xs text-muted-foreground">{rating.date}</span>
                 </CardHeader>
                 <CardContent className="grid grid-cols-4 gap-4 text-center">
                   {["Roman", "Harlan", "Pam", "Brian"].map(person => (
                     <div key={person} className="space-y-1">
                       <p className="text-xs font-bold text-muted-foreground uppercase">{person}</p>
                       <div className="flex justify-center">
                         {(rating.ratings as any)[person] === "up" ? (
                           <ThumbsUp className="h-5 w-5 text-green-500" />
                         ) : (rating.ratings as any)[person] === "down" ? (
                           <ThumbsDown className="h-5 w-5 text-red-500" />
                         ) : (
                           <span className="text-muted-foreground text-xs italic">N/A</span>
                         )}
                       </div>
                     </div>
                   ))}
                 </CardContent>
               </Card>
             );
          })}
        </div>
      </div>
    </Layout>
  );
}
