import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const list = query({
  args: {
    profileId: v.optional(v.id("profiles")),
  },
  handler: async (ctx, args) => {
    if (args.profileId) {
      return await ctx.db
        .query("research")
        .withIndex("by_profile", (q) => q.eq("profileId", args.profileId!))
        .order("desc")
        .collect();
    }
    return await ctx.db.query("research").order("desc").collect();
  },
});

export const get = query({
  args: { id: v.id("research") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    profileId: v.optional(v.id("profiles")),
    query: v.optional(v.string()),
    sources: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("research", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const remove = mutation({
  args: { id: v.id("research") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
