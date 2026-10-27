"use client";

import { useMutation, useQuery } from "convex/react";
import { anyApi } from "convex/server";
import { Component, useEffect, useState, type ReactNode } from "react";

/**
 * Home-page live pulse badge: a green flickering dot followed by just the
 * numbers — total site visits · people active right now.
 *
 * Connected mode (NEXT_PUBLIC_CONVEX_URL set): real global counts from the
 * Convex stats backend — one visit per browser session, presence heartbeats
 * every minute with a 5-minute active window.
 *
 * Offline mode: the visitor's own visit count from localStorage + themselves
 * as the active user, so the badge still renders honest numbers.
 * If the Convex query throws (backend not deployed yet), the boundary falls
 * back to offline numbers instead of breaking the page.
 */

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL;
const SESSION_KEY = "sc_live_session";
const VISIT_DONE_KEY = "sc_visit_done";
const LOCAL_VISITS_KEY = "sc_local_visits";

function getSessionId(): string {
  try {
    let id = sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `s-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return "no-session";
  }
}

function markLocalVisit(): number {
  try {
    if (!sessionStorage.getItem(VISIT_DONE_KEY)) {
      const total = Number(localStorage.getItem(LOCAL_VISITS_KEY) ?? "0") + 1;
      localStorage.setItem(LOCAL_VISITS_KEY, String(total));
      sessionStorage.setItem(VISIT_DONE_KEY, "1");
    }
    return Number(localStorage.getItem(LOCAL_VISITS_KEY) ?? "0");
  } catch {
    return 1;
  }
}

function Badge({ visits, active }: { visits: number | null; active: number | null }) {
  return (
    <span
      className="flex items-center gap-2"
      aria-label={
        visits === null && active === null
          ? "Live site activity connecting"
          : `${visits ?? 0} site visits, ${active ?? 0} active right now`
      }
    >
      <span
        className="size-2 animate-pulse rounded-full bg-[#65e66e] shadow-[0_0_10px_#65e66e]"
        aria-hidden
      />
      <span className="tabular-nums text-[#b7ffba]">
        {visits === null ? "—" : visits.toLocaleString("en-IN")}
      </span>
      <span className="text-[#8af58f]/50" aria-hidden>
        ·
      </span>
      <span className="tabular-nums text-[#b7ffba]">
        {active === null ? "—" : active}
      </span>
    </span>
  );
}

function ConnectedLiveStats() {
  const stats = useQuery(anyApi.stats.liveStats);
  const heartbeat = useMutation(anyApi.stats.heartbeat);
  const recordVisit = useMutation(anyApi.stats.recordVisit);

  useEffect(() => {
    const sessionId = getSessionId();

    try {
      if (!sessionStorage.getItem(VISIT_DONE_KEY)) {
        void recordVisit({ sessionId })
          .then(() => sessionStorage.setItem(VISIT_DONE_KEY, "1"))
          .catch(() => {
            /* offline — localStorage fallback still counted the visit */
            markLocalVisit();
          });
      }
    } catch {
      /* storage blocked */
    }

    const beat = () => {
      void heartbeat({ sessionId }).catch(() => {
        /* transient — next beat retries */
      });
    };
    beat();
    const id = window.setInterval(beat, 60_000);
    const onVisibility = () => {
      if (!document.hidden) beat();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [heartbeat, recordVisit]);

  return (
    <Badge
      visits={stats?.visits ?? null}
      active={stats?.active ?? null}
    />
  );
}

function OfflineLiveStats() {
  // Lazy init: this subtree is client-only (ssr: false route shell), so
  // localStorage/sessionStorage are safe during the first render.
  const [visits] = useState<number>(() => markLocalVisit());

  return <Badge visits={visits} active={1} />;
}

class StatsBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    console.warn("[live-stats] falling back to offline counts:", error);
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

export function LiveStats() {
  const content = CONVEX_URL ? <ConnectedLiveStats /> : <OfflineLiveStats />;
  return <StatsBoundary fallback={<OfflineLiveStats />}>{content}</StatsBoundary>;
}
