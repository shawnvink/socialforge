import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const list = query({
  args: {
    platform: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (args.platform) {
      return await ctx.db
        .query("profiles")
        .withIndex("by_platform", (q) => q.eq("platform", args.platform!))
        .order("desc")
        .collect();
    }
    return await ctx.db.query("profiles").order("desc").collect();
  },
});

export const get = query({
  args: { id: v.id("profiles") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    creatorName: v.string(),
    platform: v.string(),
    voiceBible: v.optional(v.string()),
    expressionProfile: v.string(),
    helixScore: v.number(),
    modelUsed: v.string(),
    provider: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("profiles", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const remove = mutation({
  args: { id: v.id("profiles") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
