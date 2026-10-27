"use client";

import "../index.css";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { MemoryRouter, Route, Routes, useLocation } from "react-router";
import { Toaster } from "@/components/ui/sonner";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { StickyBookBar } from "@/components/StickyBookBar";
import { ScrollToTop } from "@/components/ScrollToTop";
import { SocialDock } from "@/components/SocialDock";
import { StreetCultureBot } from "@/components/StreetCultureBot";
import { Intro } from "@/components/Intro";
import { ClickSound } from "@/components/ClickSound";
import { PixelCloud } from "@/components/PixelCloud";
import Home from "../legacy-pages/Home";
import About from "../legacy-pages/About";
import Artists from "../legacy-pages/Artists";
import ArtistDetail from "../legacy-pages/ArtistDetail";
import Portfolio from "../legacy-pages/Portfolio";
import Gallery from "../legacy-pages/Gallery";
import Academy from "../legacy-pages/Academy";
import Blog from "../legacy-pages/Blog";
import BlogPost from "../legacy-pages/BlogPost";
import Book from "../legacy-pages/Book";
import Careers from "../legacy-pages/Careers";
import Contact from "../legacy-pages/Contact";
import ConceptLab from "../legacy-pages/ConceptLab";
import Privacy from "../legacy-pages/Privacy";
import Terms from "../legacy-pages/Terms";
import NotFound from "../legacy-pages/NotFound";

function RouteSyncer() {
  const location = useLocation();
  const router = useRouter();

  // Keep the browser URL in step with react-router navigation inside the
  // MemoryRouter (nav links, internal buttons) so deep links, refresh and the
  // back button all behave. Next-side navigations remount this shell with a
  // matching routePath, so this never loops.
  useEffect(() => {
    if (typeof window !== "undefined" && location.pathname !== window.location.pathname) {
      router.push(location.pathname);
    }
  }, [location.pathname, router]);

  return <>{location.pathname && null}</>;
}

function ConvexUnavailable() {
  return (
    <main className="flex min-h-[60vh] items-center justify-center bg-ink px-6 py-24 text-center">
      <div>
        <p className="font-display text-xs uppercase tracking-[0.3em] text-bone/50">Studio services unavailable</p>
        <p className="mt-3 max-w-md text-sm text-bone/70">This preview is running without its Convex backend. The rest of the studio remains available.</p>
      </div>
    </main>
  );
}

function NativeContent() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/artists" element={<Artists />} />
      <Route path="/artists/:artistId" element={<ArtistDetail />} />
      <Route path="/artists/:artistId/portfolio" element={<Portfolio />} />
      <Route path="/gallery" element={<Gallery />} />
      <Route path="/academy" element={<Academy />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:slug" element={<BlogPost />} />
      <Route path="/book" element={<Book />} />
      <Route path="/redeem" element={<ConvexUnavailable />} />
      <Route path="/careers" element={<Careers />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/concept" element={<ConceptLab />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default function NativeRoutePage({ routePath = "/" }: { routePath?: string }) {
  return (
    <>
      <ClickSound />
      <PixelCloud />
      <Intro />
      <MemoryRouter key={routePath} initialEntries={[routePath]}>
        <RouteSyncer />
        <ScrollToTop />
        <Navbar />
        <main id="main"><NativeContent /></main>
        <Footer />
        <StickyBookBar />
        <SocialDock />
        <StreetCultureBot />
      </MemoryRouter>
      <Toaster />
      <SpeedInsights />
    </>
  );
}

