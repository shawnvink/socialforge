import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const get = query({
  handler: async (ctx) => {
    const settings = await ctx.db.query("settings").first();
    if (!settings) {
      return {
        activeProvider: "anthropic",
        defaultModel: "claude-sonnet-4-5-20250929",
        defaultPlatform: undefined,
      };
    }
    return settings;
  },
});

export const upsert = mutation({
  args: {
    activeProvider: v.string(),
    defaultModel: v.string(),
    defaultPlatform: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("settings").first();
    const now = Date.now();
    if (existing) {
      await ctx.db.patch(existing._id, { ...args, updatedAt: now });
      return existing._id;
    }
    return await ctx.db.insert("settings", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
  },
});
