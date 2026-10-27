import { v } from "convex/values";
import { mutation, query, type MutationCtx, type QueryCtx } from "./_generated/server";

/**
 * Public site stats behind the home-page live pulse badge.
 *
 * - visits: one per browser session, counted atomically in a counter doc
 *   (mutations touching the same doc serialize, so no lost increments).
 * - active: presence docs heartbeated by open tabs; anything not seen for
 *   5 minutes no longer counts, and heartbeats prune ghosts after 10.
 *
 * No PII is stored — only opaque random session ids.
 */

const ACTIVE_WINDOW_MS = 5 * 60 * 1000;
const PRUNE_WINDOW_MS = 10 * 60 * 1000;

async function visitsCounter(ctx: MutationCtx) {
  const existing = await ctx.db
    .query("siteCounters")
    .withIndex("by_key", (q) => q.eq("key", "visits"))
    .first();
  if (existing) return existing;
  const id = await ctx.db.insert("siteCounters", { key: "visits", value: 0 });
  return (await ctx.db.get(id))!;
}

async function prunePresence(ctx: MutationCtx) {
  const cutoff = Date.now() - PRUNE_WINDOW_MS;
  const stale = await ctx.db
    .query("sitePresence")
    .filter((q) => q.lt(q.field("lastSeen"), cutoff))
    .take(100);
  for (const doc of stale) await ctx.db.delete(doc._id);
}

/** Called once per browser session (guarded client-side by sessionStorage). */
export const recordVisit = mutation({
  args: { sessionId: v.string() },
  handler: async (ctx, { sessionId }) => {
    const existing = await ctx.db
      .query("siteSessions")
      .withIndex("by_sessionId", (q) => q.eq("sessionId", sessionId))
      .first();
    if (!existing) {
      await ctx.db.insert("siteSessions", { sessionId });
      const counter = await visitsCounter(ctx);
      await ctx.db.patch(counter._id, { value: counter.value + 1 });
      await prunePresence(ctx);
    }
    const counter = await visitsCounter(ctx);
    return counter.value;
  },
});

/** Called by every open tab; refreshes this session's presence stamp. */
export const heartbeat = mutation({
  args: { sessionId: v.string() },
  handler: async (ctx, { sessionId }) => {
    const now = Date.now();
    const existing = await ctx.db
      .query("sitePresence")
      .withIndex("by_sessionId", (q) => q.eq("sessionId", sessionId))
      .first();
    if (existing) await ctx.db.patch(existing._id, { lastSeen: now });
    else await ctx.db.insert("sitePresence", { sessionId, lastSeen: now });
    await prunePresence(ctx);
  },
});

/** Aggregated counts for the badge. */
export const liveStats = query({
  handler: async (ctx: QueryCtx) => {
    const cutoff = Date.now() - ACTIVE_WINDOW_MS;
    const [counter, activeDocs] = await Promise.all([
      ctx.db
        .query("siteCounters")
        .withIndex("by_key", (q) => q.eq("key", "visits"))
        .first(),
      ctx.db
        .query("sitePresence")
        .filter((q) => q.gt(q.field("lastSeen"), cutoff))
        .collect(),
    ]);
    return { visits: counter?.value ?? 0, active: activeDocs.length };
  },
});
