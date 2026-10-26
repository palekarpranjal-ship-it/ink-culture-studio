import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/** A visitor counts as live if their tab sent a heartbeat within this window. */
const LIVE_WINDOW_MS = 60_000;
const STALE_CLEANUP_BATCH = 25;

const sessionIdValidator = v.string();

function isValidSessionId(sessionId: string) {
  return /^[a-zA-Z0-9-]{8,64}$/.test(sessionId);
}

export const heartbeat = mutation({
  args: { sessionId: sessionIdValidator },
  handler: async (ctx, { sessionId }) => {
    if (!isValidSessionId(sessionId)) return;
    const now = Date.now();

    const existing = await ctx.db
      .query("visitorPresence")
      .withIndex("by_session", (q) => q.eq("sessionId", sessionId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, { lastSeen: now });
    } else {
      await ctx.db.insert("visitorPresence", { sessionId, lastSeen: now });
    }

    // Opportunistically prune tabs that closed without saying goodbye.
    const stale = await ctx.db
      .query("visitorPresence")
      .withIndex("by_lastSeen", (q) => q.lt("lastSeen", now - LIVE_WINDOW_MS * 5))
      .take(STALE_CLEANUP_BATCH);
    for (const row of stale) await ctx.db.delete(row._id);
  },
});

export const leave = mutation({
  args: { sessionId: sessionIdValidator },
  handler: async (ctx, { sessionId }) => {
    if (!isValidSessionId(sessionId)) return;
    const existing = await ctx.db
      .query("visitorPresence")
      .withIndex("by_session", (q) => q.eq("sessionId", sessionId))
      .first();
    if (existing) await ctx.db.delete(existing._id);
  },
});

export const liveCount = query({
  args: {},
  handler: async (ctx) => {
    const cutoff = Date.now() - LIVE_WINDOW_MS;
    const live = await ctx.db
      .query("visitorPresence")
      .withIndex("by_lastSeen", (q) => q.gt("lastSeen", cutoff))
      .collect();
    return live.length;
  },
});
