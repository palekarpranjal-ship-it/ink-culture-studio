import { useEffect, useState } from "react";

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
        <div className="grid size-9 place-items-center border border-acid/70 bg-ink font-mono text-[9px] font-bold leading-none text-acid">
          <span aria-hidden>SC</span>
          <span aria-hidden>BOT</span>
        </div>
        <div>
          <p className="font-display text-[10px] font-bold uppercase tracking-[0.18em]">Street Culture Bot</p>
          <p className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.12em] text-bone/55">
            {count === 0 ? "ready for your idea" : `${count} booking${count === 1 ? "" : "s"} in the book`}
          </p>
        </div>
      </div>
    </aside>
  );
}
