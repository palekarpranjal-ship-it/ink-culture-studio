import { useEffect, useState } from "react";
import { Link } from "react-router";

let bookingCount = 0;
const bookingEvent = "street-culture-booking";

export function notifyStreetCultureBooking() {
  bookingCount += 1;
  window.dispatchEvent(new CustomEvent(bookingEvent, { detail: bookingCount }));
}

export function StreetCultureBot() {
  const [count, setCount] = useState(bookingCount);

  useEffect(() => {
    const onBooking = (event: Event) => {
      const nextCount = (event as CustomEvent<number>).detail;
      setCount(nextCount);
    };
    window.addEventListener(bookingEvent, onBooking);
    return () => window.removeEventListener(bookingEvent, onBooking);
  }, []);

  return (
    <aside className="fixed bottom-5 right-5 z-40" aria-label="Street Culture booking bot">
      <div className="flex items-center gap-3 border-2 border-bone/25 bg-[#101b2d] px-3 py-2 text-bone shadow-[4px_4px_0_0_var(--blood)]">
        <div className="relative grid size-10 place-items-center border border-acid/70 bg-ink text-acid">
          <span aria-hidden className="absolute -top-1 left-2 h-2 w-5 animate-pulse border border-acid/70 bg-acid/30" />
          <span aria-hidden className="h-4 w-2 rotate-12 border-2 border-acid bg-acid/20" />
          <span aria-hidden className="absolute bottom-1 left-1 h-1 w-2 bg-acid" />
          <span aria-hidden className="absolute bottom-1 right-1 h-1 w-2 bg-acid" />
        </div>
        <div>
          <p className="font-display text-[10px] font-bold uppercase tracking-[0.18em]">Street Culture Bot</p>
          <p className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.12em] text-bone/55">
            {count === 0 ? "ready for your idea" : `${count} booking${count === 1 ? "" : "s"} in the book`}
          </p>
          <div className="mt-1 flex gap-2 text-[9px] uppercase tracking-[0.12em]">
            <Link to="/artists" className="text-acid hover:text-bone">Artists</Link>
            <Link to="/gallery" className="text-acid hover:text-bone">Gallery</Link>
            <Link to="/book" className="text-blood hover:text-bone">Book</Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
