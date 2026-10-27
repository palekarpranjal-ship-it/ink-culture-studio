"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import type { ReactNode } from "react";

/**
 * Mounts the Convex client when NEXT_PUBLIC_CONVEX_URL is configured.
 * Without it (local preview, pre-setup deploys) the app renders normally —
 * features that need Convex degrade to their offline fallbacks.
 */

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL;

let client: ConvexReactClient | null = null;

function getConvexClient(): ConvexReactClient | null {
  if (!CONVEX_URL) return null;
  if (!client) client = new ConvexReactClient(CONVEX_URL);
  return client;
}

export function AppProviders({ children }: { children: ReactNode }) {
  const convex = getConvexClient();
  if (!convex) return <>{children}</>;
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}
