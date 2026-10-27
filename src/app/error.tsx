"use client";

import { useEffect } from "react";

/**
 * Root error boundary: an exception inside any page renders this instead of
 * an unmounted tree. Deliberately free of app-level imports so it still
 * renders when the failing chunk is the one that would provide them.
 */
export default function GlobalRouteError({
  error,
  reset,
}: {
  error: (Error & { digest?: string }) | { message: string; digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[streetculture] route error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center bg-[#0d0d0d] px-6 text-center">
      <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-[#f1ede4]/40">
        Street Culture Tattoo &amp; Academy
      </p>
      <h1 className="mt-5 font-sans text-4xl font-black uppercase tracking-tight text-[#f1ede4] sm:text-5xl">
        Something broke
      </h1>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-[#f1ede4]/65">
        The page hit an unexpected error. Nothing you filled in elsewhere is lost —
        try again, or head back to the studio home.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="border-2 border-[#f1ede4] bg-[#f1ede4] px-6 py-3 font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#0d0d0d] transition-colors hover:bg-transparent hover:text-[#f1ede4]"
        >
          Try again
        </button>
        <a
          href="/"
          className="border-2 border-[#f1ede4]/30 px-6 py-3 font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#f1ede4]/80 transition-colors hover:border-[#f1ede4]"
        >
          Back to home
        </a>
      </div>
    </div>
  );
}
