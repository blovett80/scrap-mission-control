import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("contentItems").order("desc").take(100);
  },
});

export const listByStage = query({
  args: {
    stage: v.union(
      v.literal("idea"),
      v.literal("script"),
      v.literal("thumbnail"),
      v.literal("filming"),
      v.literal("published")
    ),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("contentItems")
      .withIndex("by_stage", (q) => q.eq("stage", args.stage))
      .order("desc")
      .take(50);
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    stage: v.union(
      v.literal("idea"),
      v.literal("script"),
      v.literal("thumbnail"),
      v.literal("filming"),
      v.literal("published")
    ),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("contentItems", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("contentItems"),
    title: v.optional(v.string()),
    script: v.optional(v.string()),
    thumbnailUrl: v.optional(v.string()),
    stage: v.optional(v.union(
      v.literal("idea"),
      v.literal("script"),
      v.literal("thumbnail"),
      v.literal("filming"),
      v.literal("published")
    )),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});

export const moveStage = mutation({
  args: {
    id: v.id("contentItems"),
    stage: v.union(
      v.literal("idea"),
      v.literal("script"),
      v.literal("thumbnail"),
      v.literal("filming"),
      v.literal("published")
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      stage: args.stage,
      updatedAt: Date.now(),
    });
  },
});

export const remove = mutation({
  args: { id: v.id("contentItems") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
