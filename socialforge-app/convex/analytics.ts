import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const logUsage = mutation({
  args: {
    contentId: v.optional(v.id("content")),
    profileId: v.optional(v.id("profiles")),
    action: v.string(),
    model: v.string(),
    provider: v.string(),
    promptTokens: v.number(),
    completionTokens: v.number(),
    cost: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("usage", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const getStats = query({
  handler: async (ctx) => {
    const allUsage = await ctx.db.query("usage").collect();
    const totalCost = allUsage.reduce((sum, u) => sum + u.cost, 0);
    const totalTokens = allUsage.reduce(
      (sum, u) => sum + u.promptTokens + u.completionTokens,
      0
    );

    const now = Date.now();
    const dayAgo = now - 86400000;
    const weekAgo = now - 604800000;
    const monthAgo = now - 2592000000;

    const dailyCost = allUsage
      .filter((u) => u.createdAt > dayAgo)
      .reduce((sum, u) => sum + u.cost, 0);
    const weeklyCost = allUsage
      .filter((u) => u.createdAt > weekAgo)
      .reduce((sum, u) => sum + u.cost, 0);
    const monthlyCost = allUsage
      .filter((u) => u.createdAt > monthAgo)
      .reduce((sum, u) => sum + u.cost, 0);

    const byAction = allUsage.reduce(
      (acc, u) => {
        acc[u.action] = (acc[u.action] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return {
      totalCost,
      totalTokens,
      totalCalls: allUsage.length,
      dailyCost,
      weeklyCost,
      monthlyCost,
      byAction,
    };
  },
});
