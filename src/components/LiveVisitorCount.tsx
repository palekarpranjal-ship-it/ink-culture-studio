import { ConvexProvider, ConvexReactClient, useMutation, useQuery } from "convex/react";
import { makeFunctionReference } from "convex/server";
import { useEffect } from "react";

// Explicit references keep this compiling even before Convex codegen picks up presence.ts.
const presenceApi = {
  liveCount: makeFunctionReference<"query", Record<string, never>, number>("presence:liveCount"),
  heartbeat: makeFunctionReference<"mutation", { sessionId: string }, null>("presence:heartbeat"),
  leave: makeFunctionReference<"mutation", { sessionId: string }, null>("presence:leave"),
};

const HEARTBEAT_MS = 20_000;
const SESSION_KEY = "ink-visitor-session";

const convexUrl = import.meta.env.VITE_CONVEX_URL as string | undefined;
const convex = convexUrl ? new ConvexReactClient(convexUrl) : null;

function getSessionId() {
  try {
    const existing = sessionStorage.getItem(SESSION_KEY);
    if (existing) return existing;
    const id = crypto.randomUUID();
    sessionStorage.setItem(SESSION_KEY, id);
    return id;
  } catch {
    return crypto.randomUUID();
  }
}

function Counter() {
  const count = useQuery(presenceApi.liveCount, {});
  const heartbeat = useMutation(presenceApi.heartbeat);
  const leave = useMutation(presenceApi.leave);

  useEffect(() => {
    const sessionId = getSessionId();
    const beat = () => {
      if (document.visibilityState === "visible") void heartbeat({ sessionId });
    };
    const bye = () => void leave({ sessionId });

    beat();
    const interval = window.setInterval(beat, HEARTBEAT_MS);
    document.addEventListener("visibilitychange", beat);
    window.addEventListener("pagehide", bye);
    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", beat);
      window.removeEventListener("pagehide", bye);
    };
  }, [heartbeat, leave]);

  return <CountText value={count} />;
}

function CountText({ value }: { value: number | undefined }) {
  return (
    <span className="tabular-nums text-[#b7ffba]" aria-live="polite">
      {value === undefined ? "—" : value.toLocaleString("en-IN")}
    </span>
  );
}

/** Live count of visitors currently on the site, kept in sync via Convex. */
export function LiveVisitorCount() {
  if (!convex) return <CountText value={undefined} />;
  return (
    <ConvexProvider client={convex}>
      <Counter />
    </ConvexProvider>
  );
}
