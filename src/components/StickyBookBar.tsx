"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { PixelButton } from "@/components/PixelButton";
import { contact } from "@/config/contact";

/** Mobile-only sticky CTA bar; appears after scrolling past the hero. */
const WHATSAPP_BOOKING_TEXT =
  "Hi Street Culture! I'd like to book a tattoo/piercing session. Here's what I have in mind…";

export function StickyBookBar() {
  const [visible, setVisible] = useState(() => window.scrollY > 480);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 480);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname === "/book") return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80 }}
          animate={{ y: 0 }}
          exit={{ y: 80 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-0 bottom-0 z-40 border-t border-bone/15 bg-ink/95 px-3 py-2 backdrop-blur-md sm:hidden"
        >
          <div className="grid grid-cols-2 gap-2">
            <PixelButton
              href={`https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent(WHATSAPP_BOOKING_TEXT)}`}
              size="sm"
              className="py-2 text-[10px]"
            >
              Book on WhatsApp
            </PixelButton>
            <PixelButton
              href={`tel:+${contact.whatsappNumber}`}
              size="sm"
              className="inline-flex items-center justify-center gap-1.5 py-2 text-[10px]"
            >
              <Phone className="size-3.5" /> Call Now
            </PixelButton>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
