import { useEffect, useState } from "react";
import { Wrench } from "lucide-react";
import { Link } from "react-router";

let bookingCount = 0;
const bookingEvent = "street-culture-booking";

export function notifyStreetCultureBooking() {
  bookingCount += 1;
  window.dispatchEvent(new CustomEvent(bookingEvent, { detail: bookingCount }));
}

export function StreetCultureBot() {
  const [count, setCount] = useState(bookingCount);
  const [open, setOpen] = useState(false);

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
      <div className="flex items-end gap-3">
        {open ? <div className="flex flex-col gap-2 border-2 border-bone/25 bg-[#101b2d] p-3 text-bone shadow-[4px_4px_0_0_var(--blood)]">
          <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-bone/50">Choose a move</p>
          <Link to="/artists" className="border border-acid/50 px-3 py-2 text-[10px] uppercase tracking-[0.14em] text-acid hover:bg-acid hover:text-ink">Meet artists</Link>
          <Link to="/gallery" className="border border-acid/50 px-3 py-2 text-[10px] uppercase tracking-[0.14em] text-acid hover:bg-acid hover:text-ink">Browse gallery</Link>
          <Link to="/book" className="border border-blood px-3 py-2 text-[10px] uppercase tracking-[0.14em] text-blood hover:bg-blood hover:text-ink">Book a session</Link>
        </div> : null}
        <button type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-label={open ? "Close Street Culture Bot menu" : "Open Street Culture Bot menu"} title="Street Culture Bot" className="group relative grid size-24 place-items-center text-acid drop-shadow-[0_0_12px_rgba(255,255,255,0.7)] transition hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-acid">

        <div className="relative grid size-20 place-items-center">
          <span aria-hidden className="absolute -left-5 top-2 h-4 w-8 rounded-full bg-white/90 blur-[1px] animate-[cloud-drift_4s_ease-in-out_infinite]" />
          <span aria-hidden className="absolute -top-2 left-2 h-3 w-7 rounded-full bg-white/80 blur-[1px] animate-[cloud-drift_5s_ease-in-out_infinite_reverse]" />
          <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/images-13-hVtg4LqbkqzakOt0pt9JCA52YwQHr0.jpeg" alt="" className="relative z-10 h-20 w-20 object-contain mix-blend-multiply drop-shadow-[0_5px_2px_rgba(0,0,0,0.4)]" />
          <Wrench aria-hidden className="absolute z-20 h-4 w-4 rotate-12 text-acid" />
          <span aria-hidden className="absolute bottom-1 left-1 h-1 w-2 bg-acid" />
          <span aria-hidden className="absolute bottom-1 right-1 h-1 w-2 bg-acid" />
        </div>
        <span className="sr-only">Street Culture Bot{count > 0 ? `, ${count} bookings in the book` : ", ready for your idea"}</span>
        </button>
      </div>
    </aside>
  );
}
