import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  tasks: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    status: v.union(
      v.literal("backlog"),
      v.literal("todo"),
      v.literal("in_progress"),
      v.literal("done")
    ),
    assignee: v.union(v.literal("me"), v.literal("assistant")),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_status", ["status"])
    .index("by_assignee", ["assignee"]),

  contentItems: defineTable({
    title: v.string(),
    stage: v.union(
      v.literal("idea"),
      v.literal("script"),
      v.literal("thumbnail"),
      v.literal("filming"),
      v.literal("published")
    ),
    script: v.optional(v.string()),
    thumbnailUrl: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_stage", ["stage"]),

  scheduledTasks: defineTable({
    title: v.string(),
    scheduledAt: v.number(),
    recurrence: v.optional(v.string()),
    completed: v.boolean(),
    createdAt: v.number(),
  }).index("by_scheduledAt", ["scheduledAt"]),

  memories: defineTable({
    title: v.string(),
    content: v.string(),
    date: v.string(),
    createdAt: v.number(),
  }).index("by_date", ["date"]),

  agents: defineTable({
    name: v.string(),
    role: v.string(),
    responsibilities: v.array(v.string()),
    status: v.union(v.literal("active"), v.literal("idle")),
    avatar: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_status", ["status"]),

  officeMembers: defineTable({
    agentId: v.optional(v.id("agents")),
    name: v.string(),
    role: v.string(),
    isWorking: v.boolean(),
    currentTask: v.optional(v.string()),
    x: v.number(),
    y: v.number(),
    updatedAt: v.number(),
  }),

  meals: defineTable({
    name: v.string(),
    chef: v.optional(v.string()),
    lastServed: v.number(),
  }).index("by_name", ["name"]),

  mealRatings: defineTable({
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
  }).index("by_mealId", ["mealId"]),
});
