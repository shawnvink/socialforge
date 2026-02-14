import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const list = query({
  args: {
    platform: v.optional(v.string()),
    kanbanStatus: v.optional(v.string()),
    profileId: v.optional(v.id("profiles")),
  },
  handler: async (ctx, args) => {
    if (args.profileId) {
      return await ctx.db
        .query("content")
        .withIndex("by_profile", (q) => q.eq("profileId", args.profileId!))
        .order("desc")
        .collect();
    }
    if (args.platform) {
      return await ctx.db
        .query("content")
        .withIndex("by_platform", (q) => q.eq("platform", args.platform!))
        .order("desc")
        .collect();
    }
    if (args.kanbanStatus) {
      return await ctx.db
        .query("content")
        .withIndex("by_status", (q) => q.eq("kanbanStatus", args.kanbanStatus!))
        .order("desc")
        .collect();
    }
    return await ctx.db.query("content").order("desc").collect();
  },
});

export const get = query({
  args: { id: v.id("content") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    profileId: v.id("profiles"),
    platform: v.string(),
    contentType: v.string(),
    topic: v.string(),
    generatedContent: v.string(),
    modelUsed: v.string(),
    provider: v.string(),
    promptTokens: v.number(),
    completionTokens: v.number(),
    cost: v.number(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("content", {
      ...args,
      kanbanStatus: "draft",
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("content"),
    kanbanStatus: v.optional(v.string()),
    optimizedContent: v.optional(v.string()),
    validationReport: v.optional(v.string()),
    validationScore: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const filtered = Object.fromEntries(
      Object.entries(updates).filter(([, v]) => v !== undefined)
    );
    await ctx.db.patch(id, { ...filtered, updatedAt: Date.now() });
  },
});

export const remove = mutation({
  args: { id: v.id("content") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
