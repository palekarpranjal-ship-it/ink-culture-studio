import { useEffect, useMemo, useState } from "react";
import { Link } from "@/next/Link";
import { galleryItems } from "@/data/gallery";

const categories = ["Realism", "Colour Tattoos", "Animal", "Portrait", "Religious"];

export function StudioArchiveSlideshow() {
  const slides = useMemo(() => {
    const chosen = categories.flatMap((category) =>
      galleryItems.filter((item) => item.category.toLowerCase().includes(category.toLowerCase())).slice(0, 2),
    );
    return chosen.length ? chosen : galleryItems.slice(0, 10);
  }, []);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => setActive((current) => (current + 1) % slides.length), 6500);
    return () => window.clearInterval(timer);
  }, [slides.length]);

  const current = slides[active];
  if (!current) return null;

  return (
    <div className="overflow-hidden border border-bone/10 bg-[#101010]">
      <div className="grid md:grid-cols-[1.15fr_0.85fr]">
        <div className="relative aspect-[4/3] overflow-hidden bg-[#0b0b0b] md:aspect-[16/10]">
          {slides.map((item, index) => (
            <img
              key={item.id}
              src={item.src}
              alt={index === active ? `${item.category} tattoo from the studio archive` : ""}
              aria-hidden={index !== active}
              loading={index === 0 ? "eager" : "lazy"}
              decoding="async"
              className={`absolute inset-0 h-full w-full object-contain p-3 transition-opacity duration-1000 ${index === active ? "opacity-100" : "opacity-0"}`}
            />
          ))}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent" />
          <p className="absolute bottom-4 left-4 font-mono text-[9px] uppercase tracking-[0.22em] text-bone/65">{active + 1} / {slides.length}</p>
        </div>
        <div className="flex flex-col justify-between gap-8 p-5 sm:p-7 md:p-8">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-blood">Now showing</p>
            <h3 className="mt-3 font-display text-3xl uppercase leading-none text-bone sm:text-4xl">{current.category}</h3>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-bone/60">A slow rotation through the studio archive — realism, colour, animal, portrait and religious tattoo work.</p>
          </div>
          <div className="flex items-center justify-between gap-4">
            <div className="flex gap-1.5" aria-label="Archive slideshow progress">
              {slides.map((item, index) => <button key={item.id} type="button" aria-label={`Show archive image ${index + 1}`} onClick={() => setActive(index)} className={`h-1.5 rounded-full transition-all ${index === active ? "w-8 bg-blood" : "w-2 bg-bone/25"}`} />)}
            </div>
            <Link to="/gallery" className="shrink-0 font-mono text-[10px] uppercase tracking-[0.18em] text-[#2bb7ff] hover:text-bone">View gallery →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudioArchiveSlideshow;
