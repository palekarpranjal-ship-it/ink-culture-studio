"use client";

import { useEffect } from "react";

/**
 * Last-resort boundary: renders when the root layout itself fails.
 * Must supply <html>/<body> because no parent document exists anymore.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: (Error & { digest?: string }) | { message: string; digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[streetculture] global error:", error);
  }, [error]);
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0d0d0d",
          color: "#f1ede4",
          fontFamily: "system-ui, -apple-system, sans-serif",
          textAlign: "center",
          padding: "24px",
        }}
      >
        <div>
          <p style={{ fontSize: 11, letterSpacing: "0.35em", textTransform: "uppercase", opacity: 0.5 }}>
            Street Culture Tattoo &amp; Academy
          </p>
          <h1 style={{ fontSize: 40, fontWeight: 900, textTransform: "uppercase", margin: "20px 0 12px" }}>
            We&apos;ll be right back
          </h1>
          <p style={{ fontSize: 14, lineHeight: 1.6, opacity: 0.7, maxWidth: 420, margin: "0 auto" }}>
            The studio site hit an unexpected error. Please retry — or reach us on
            WhatsApp at +91 98197 00071.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: 28,
              padding: "12px 28px",
              border: "2px solid #f1ede4",
              background: "#f1ede4",
              color: "#0d0d0d",
              fontWeight: 700,
              fontSize: 12,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
