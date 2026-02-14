import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  profiles: defineTable({
    creatorName: v.string(),
    platform: v.string(),
    voiceBible: v.optional(v.string()),
    expressionProfile: v.string(),
    helixScore: v.number(),
    modelUsed: v.string(),
    provider: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_platform", ["platform"])
    .index("by_creator", ["creatorName"]),

  content: defineTable({
    profileId: v.id("profiles"),
    platform: v.string(),
    contentType: v.string(),
    topic: v.string(),
    generatedContent: v.string(),
    optimizedContent: v.optional(v.string()),
    validationReport: v.optional(v.string()),
    validationScore: v.optional(v.number()),
    kanbanStatus: v.string(),
    modelUsed: v.string(),
    provider: v.string(),
    promptTokens: v.number(),
    completionTokens: v.number(),
    cost: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_platform", ["platform"])
    .index("by_profile", ["profileId"])
    .index("by_status", ["kanbanStatus"]),

  settings: defineTable({
    activeProvider: v.string(),
    defaultModel: v.string(),
    defaultPlatform: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }),

  usage: defineTable({
    contentId: v.optional(v.id("content")),
    profileId: v.optional(v.id("profiles")),
    action: v.string(),
    model: v.string(),
    provider: v.string(),
    promptTokens: v.number(),
    completionTokens: v.number(),
    cost: v.number(),
    createdAt: v.number(),
  })
    .index("by_action", ["action"])
    .index("by_date", ["createdAt"]),
});
