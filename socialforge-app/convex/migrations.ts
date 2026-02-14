import { mutation } from "./_generated/server";

/**
 * One-time migration: rename genesisScore → helixScore on all existing profiles.
 * Run via: npx convex run migrations:renameGenesisToHelix
 * Then run: npx convex run migrations:cleanupGenesisField
 * Safe to run multiple times (idempotent).
 */
export const renameGenesisToHelix = mutation({
  args: {},
  handler: async (ctx) => {
    const profiles = await ctx.db.query("profiles").collect();
    let migrated = 0;

    for (const profile of profiles) {
      const doc = profile as Record<string, unknown>;
      if ("genesisScore" in doc && doc.genesisScore !== undefined) {
        await ctx.db.patch(profile._id, {
          helixScore: doc.genesisScore as number,
        });
        migrated++;
      }
    }

    return { total: profiles.length, migrated };
  },
});

/**
 * Remove the old genesisScore field from all profiles.
 * Run AFTER renameGenesisToHelix.
 */
export const cleanupGenesisField = mutation({
  args: {},
  handler: async (ctx) => {
    const profiles = await ctx.db.query("profiles").collect();
    let cleaned = 0;

    for (const profile of profiles) {
      const doc = profile as Record<string, unknown>;
      if ("genesisScore" in doc) {
        // Convex: setting a field to undefined removes it
        await ctx.db.patch(profile._id, {
          genesisScore: undefined,
        } as Record<string, unknown>);
        cleaned++;
      }
    }

    return { total: profiles.length, cleaned };
  },
});
