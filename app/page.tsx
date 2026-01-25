"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const HERO_VIDEO =
  "https://sfmcompile.club/wp-content/uploads/2026/01/Mercy-in-lingerie-giving-a-buttjob.mp4";

const CARD_VIDEOS = [
  "https://v.redd.it/hq4ydybusodg1/CMAF_480.mp4",
  "https://v.redd.it/78qdq6yi82fg1/CMAF_480.mp4",
  "https://sfmcompile.club/wp-content/uploads/2025/11/Lara-Croft-bending-over-for-pleasure-Extended.mp4",
];

const CARD_CONTENT = [
  { title: "Pornography", description: "The widest range of explicit media." },
  { title: "Hentai", description: "Hand-picked, high-resolution 2D art." },
  { title: "SFM", description: "The highest quality H-animation available." },
];

export default function Home() {
  const [hasMounted, setHasMounted] = useState(false);
  const [allowed, setAllowed] = useState(false);
  const heroRef = useRef<HTMLVideoElement>(null);
  const cardRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const accept = () => {
    setAllowed(true);
    setTimeout(() => {
      heroRef.current?.play().catch(() => {});
      cardRefs.current.forEach((v) => v?.play().catch(() => {}));
    }, 100);
  };

  if (!hasMounted) return <div className="min-h-screen bg-black" />;

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-white selection:text-black font-sans">
      {/* NSFW Gate */}
      {!allowed && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-3xl transition-all duration-700">
          <div className="max-w-sm w-full mx-4 p-8 rounded-[2.5rem] border border-white/10 bg-zinc-900/80 text-center">
            <div className="mb-6 inline-flex p-4 rounded-full bg-white/5 border border-white/10 text-2xl animate-pulse">
              🔞
            </div>
            <h2 className="text-2xl font-bold tracking-tight mb-2 uppercase italic">
              Age Verification
            </h2>
            <p className="text-white/50 text-sm mb-8">
              This site contains explicit adult content. Are you 18 or older?
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={accept}
                className="w-full py-4 rounded-2xl bg-white text-black font-bold hover:bg-zinc-200 transition-all"
              >
                I am 18 or older
              </button>
              <button
                onClick={() => (window.location.href = "https://google.com")}
                className="w-full py-4 rounded-2xl border border-white/10 text-white/40 hover:text-white transition-colors"
              >
                Exit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative pt-32 pb-10 px-6 flex flex-col items-center">
        <div className="text-center mb-12">
          <h1 className="text-xs uppercase tracking-[0.5em] text-white/20 font-bold mb-4">
            Established 2021
          </h1>
          <h2
            className="text-7xl md:text-9xl font-black tracking-tighter italic select-none"
            style={{
              WebkitTextStroke: "1px rgba(255,255,255,0.3)",
              color: "transparent",
            }}
          >
            WHXRES
          </h2>
        </div>

        {/* HERO CARD: Removed shadow-2xl, added high-contrast border hover */}
        <div
          className={`group relative w-full max-w-5xl aspect-video rounded-[2.5rem] overflow-hidden border border-white/10 bg-zinc-900 transition-all duration-1000 ${!allowed ? "blur-3xl scale-95" : "scale-100 group-hover:border-white/30"}`}
        >
          <video
            ref={heroRef}
            src={HERO_VIDEO}
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
          <div className="absolute bottom-10 left-10 right-10 flex gap-4">
            <button
              onClick={() => window.open("https://discord.gg/X7KRfEeHWS")}
              className="px-8 py-3 rounded-xl bg-white text-black font-bold hover:bg-zinc-200 transition-all"
            >
              Join Discord
            </button>
            <button
              onClick={() => window.open("https://linktr.ee/whxres")}
              className="px-8 py-3 rounded-xl bg-white/10 border border-white/10 backdrop-blur-md font-bold hover:bg-white/20 transition-all"
            >
              Linktree
            </button>
          </div>
        </div>
      </section>

      {/* Grid Section - Landscape Layout */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {CARD_VIDEOS.map((video, i) => (
            <div key={i} className="group">
              {/* CARD: Removed shadows, added a bright white glow on hover via border-white/40 */}
              <div
                className={`relative aspect-video rounded-[2rem] overflow-hidden border border-white/5 bg-zinc-900 transition-all duration-500 group-hover:border-white/40 group-hover:-translate-y-2 ${!allowed ? "blur-xl" : ""}`}
              >
                <video
                  ref={(el) => {
                    cardRefs.current[i] = el;
                  }}
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover opacity-40 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                  src={video}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="text-lg font-bold mb-1 tracking-tight">
                    {CARD_CONTENT[i].title}
                  </h3>
                  <p className="text-[11px] text-white/40 group-hover:text-white/70 transition-colors line-clamp-2 uppercase tracking-widest">
                    {CARD_CONTENT[i].description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="py-20 text-center border-t border-white/5">
        <p className="text-[10px] uppercase tracking-[0.4em] text-white/10">
          Your daily curated feed • 2021
        </p>
      </footer>
    </main>
  );
}
