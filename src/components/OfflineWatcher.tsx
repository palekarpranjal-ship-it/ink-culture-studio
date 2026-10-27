"use client";

import { useEffect } from "react";
import { toast } from "sonner";

/**
 * Tells the visitor when the connection drops or returns so failed form
 * actions and unfinished bookings never fail silently.
 */
export function OfflineWatcher() {
  useEffect(() => {
    const goOffline = () =>
      toast.error("You're offline", {
        description: "Your connection dropped — form actions will pause until it's back.",
        duration: 8000,
      });
    const goOnline = () =>
      toast.success("Back online", { description: "You can continue where you left off." });

    window.addEventListener("offline", goOffline);
    window.addEventListener("online", goOnline);
    return () => {
      window.removeEventListener("offline", goOffline);
      window.removeEventListener("online", goOnline);
    };
  }, []);

  return null;
}
