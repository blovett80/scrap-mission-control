import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("meals").order("desc").collect();
  },
});

export const getRatings = query({
  args: { limit: v.number() },
  handler: async (ctx, args) => {
    return await ctx.db.query("mealRatings").order("desc").take(args.limit);
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
