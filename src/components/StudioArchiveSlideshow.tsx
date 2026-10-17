import { useMemo } from "react";
import { Link } from "@/next/Link";
import { galleryItems } from "@/data/gallery";

const categories = ["Realism", "Colour Tattoos", "Animal", "Portrait", "Religious"];

export function StudioArchiveSlideshow() {
  const slides = useMemo(() => {
    const chosen = categories.flatMap((category) =>
      galleryItems.filter((item) => item.category.toLowerCase().includes(category.toLowerCase())).slice(0, 3),
    );
    return chosen.length ? chosen : galleryItems.slice(0, 12);
  }, []);

  if (!slides.length) return null;
  const loop = [...slides, ...slides];

  return (
    <section className="overflow-hidden border-y border-bone/10 bg-[#101010] py-5 sm:py-7" aria-label="Studio archive slideshow">
      <div className="mb-4 flex items-end justify-between gap-4 px-5 sm:px-8">
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-blood">Studio archive</p>
          <h3 className="mt-2 font-display text-2xl uppercase leading-none text-bone sm:text-3xl">The work moves first.</h3>
        </div>
        <Link to="/gallery" className="shrink-0 font-mono text-[9px] uppercase tracking-[0.18em] text-[#2bb7ff] hover:text-bone">View gallery →</Link>
      </div>
      <div className="archive-marquee group" tabIndex={0}>
        <div className="archive-marquee-track group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused]">
          {loop.map((item, index) => (
            <figure key={`${item.id}-${index}`} className="archive-slide">
              <img src={item.src} alt={`${item.category} tattoo from the studio archive`} loading={index < 4 ? "eager" : "lazy"} decoding="async" />
              <figcaption>{item.category}</figcaption>
            </figure>
          ))}
        </div>
      </div>
      <p className="mt-3 px-5 font-mono text-[8px] uppercase tracking-[0.18em] text-bone/35 sm:px-8">Realism · colour · animal · portraits · religious work</p>
    </section>
  );
}

export default StudioArchiveSlideshow;

/* Additive global animation styles are scoped by the archive class. */
const archiveStyles = `
.archive-marquee { overflow: hidden; width: 100%; mask-image: linear-gradient(90deg, transparent, black 7%, black 93%, transparent); }
.archive-marquee-track { display: flex; width: max-content; gap: 0.75rem; animation: archive-scroll 78s linear infinite; will-change: transform; }
.archive-slide { position: relative; width: clamp(220px, 30vw, 420px); height: clamp(190px, 28vw, 340px); overflow: hidden; flex: none; background: #0b0b0b; display: grid; place-items: center; }
.archive-slide img { width: auto; max-width: 100%; height: auto; max-height: 100%; object-fit: contain; display: block; opacity: .9; transition: transform .7s ease, opacity .3s ease; }
.archive-slide:hover img { transform: scale(1.035); opacity: 1; }
.archive-slide figcaption { position: absolute; inset: auto .65rem .55rem; color: rgba(255,255,255,.75); font: 9px/1 monospace; text-transform: uppercase; letter-spacing: .16em; text-shadow: 0 1px 8px #000; }
@keyframes archive-scroll { from { transform: translate3d(0,0,0); } to { transform: translate3d(calc(-50% - .375rem),0,0); } }
@media (prefers-reduced-motion: reduce) { .archive-marquee-track { animation-play-state: paused; } .archive-slide img { transition: none; } }
`;

if (typeof document !== "undefined" && !document.getElementById("archive-marquee-styles")) {
  const style = document.createElement("style");
  style.id = "archive-marquee-styles";
  style.textContent = archiveStyles;
  document.head.appendChild(style);
}
