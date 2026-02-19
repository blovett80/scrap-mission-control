import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("meals").order("desc").collect();
  },
});

export const getRatings = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    if (args.limit) {
      return await ctx.db.query("mealRatings").order("desc").take(args.limit);
    }
    return await ctx.db.query("mealRatings").order("desc").collect();
  },
});

export const getTopMeals = query({
  handler: async (ctx) => {
    const meals = await ctx.db.query("meals").collect();
    const ratings = await ctx.db.query("mealRatings").collect();

    const mealStats = meals.map((meal) => {
      const mealRatings = ratings.filter((r) => r.mealId === meal._id);
      let upVotes = 0;
      let totalVotes = 0;

      mealRatings.forEach((r) => {
        Object.values(r.ratings).forEach((v) => {
          if (v) {
            totalVotes++;
            if (v === "up") upVotes++;
          }
        });
      });

      return {
        ...meal,
        approvalRating: totalVotes > 0 ? (upVotes / totalVotes) * 100 : 0,
        totalVotes,
      };
    });

    return mealStats
      .filter((m) => m.totalVotes > 0)
      .sort((a, b) => b.approvalRating - a.approvalRating || b.totalVotes - a.totalVotes)
      .slice(0, 5);
  },
});

export const upsertMeal = mutation({
  args: { 
    name: v.string(),
    chef: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("meals")
      .withIndex("by_name", (q) => q.eq("name", args.name))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, { 
        lastServed: Date.now(),
        chef: args.chef,
      });
      return existing._id;
    }

    return await ctx.db.insert("meals", {
      name: args.name,
      chef: args.chef,
      lastServed: Date.now(),
    });
  },
});

export const addRating = mutation({
  args: {
    mealId: v.id("meals"),
    date: v.string(),
    chef: v.optional(v.string()),
    ratings: v.object({
      Roman: v.optional(v.union(v.literal("up"), v.literal("down"))),
      Harlan: v.optional(v.union(v.literal("up"), v.literal("down"))),
      Pam: v.optional(v.union(v.literal("up"), v.literal("down"))),
      Brian: v.optional(v.union(v.literal("up"), v.literal("down"))),
    }),
    comments: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("mealRatings", args);
  },
});

export const removeRating = mutation({
  args: { id: v.id("mealRatings") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const removeMeal = mutation({
  args: { id: v.id("meals") },
  handler: async (ctx, args) => {
    // Also delete all ratings for this meal
    const ratings = await ctx.db
      .query("mealRatings")
      .withIndex("by_mealId", (q) => q.eq("mealId", args.id))
      .collect();

    for (const rating of ratings) {
      await ctx.db.delete(rating._id);
    }

    await ctx.db.delete(args.id);
  },
});
