"use client";

import { useEffect, useRef, useState } from "react";
import { ShieldAlert, Globe, MessageSquare, ExternalLink } from "lucide-react";

// Video Constants
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
    // Use requestAnimationFrame for the snappiest possible play start
    requestAnimationFrame(() => {
      heroRef.current?.play().catch(() => {});
      cardRefs.current.forEach((v) => v?.play().catch(() => {}));
    });
  };

  if (!hasMounted) return <div className="min-h-screen bg-black" />;

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-white selection:text-black font-sans overflow-x-hidden">
      {/* 1. Optimized NSFW Gate */}
      {!allowed && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-[100px] transition-all duration-500">
          <div className="max-w-sm w-full mx-4 p-8 rounded-[3rem] border border-white/10 bg-zinc-900/50 text-center shadow-2xl">
            <div className="mb-6 inline-flex p-5 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 animate-pulse">
              <ShieldAlert size={32} />
            </div>
            <h2 className="text-2xl font-black tracking-tight mb-2 uppercase italic italic">
              Access Restricted
            </h2>
            <p className="text-white/40 text-xs mb-8 tracking-wide">
              This digital archive contains explicit adult content. <br />
              Are you 18 or older?
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={accept}
                className="w-full py-4 rounded-2xl bg-white text-black font-black uppercase text-xs tracking-widest hover:bg-zinc-200 transition-all active:scale-95"
              >
                Enter Archive
              </button>
              <button
                onClick={() => (window.location.href = "https://google.com")}
                className="w-full py-4 rounded-2xl border border-white/5 text-white/20 text-xs font-bold hover:text-white/50 transition-colors"
              >
                Exit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Hero Section */}
      <section className="relative pt-32 pb-10 px-6 flex flex-col items-center">
        <div className="text-center mb-16">
          <h1 className="text-[10px] uppercase tracking-[0.8em] text-white/10 font-black mb-4">
            Since 2021
          </h1>
          <h2
            className="text-8xl md:text-[12rem] font-black tracking-tighter italic select-none leading-none"
            style={{
              WebkitTextStroke: "1px rgba(255,255,255,0.15)",
              color: "transparent",
            }}
          >
            WHXRES
          </h2>
        </div>

        {/* HERO CARD - Preload: auto for instant start */}
        <div
          className={`group relative w-full max-w-6xl aspect-video rounded-[3rem] overflow-hidden border border-white/10 bg-zinc-900 transition-all duration-1000 ${
            !allowed
              ? "blur-2xl scale-[0.98] opacity-0"
              : "scale-100 opacity-100 group-hover:border-white/30"
          }`}
        >
          <video
            ref={heroRef}
            src={HERO_VIDEO}
            loop
            muted
            playsInline
            preload="auto"
            className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
          <div className="absolute bottom-10 left-10 right-10 flex flex-wrap gap-4">
            <button
              onClick={() => window.open("https://discord.gg/X7KRfEeHWS")}
              className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-black font-black uppercase text-[10px] tracking-widest hover:bg-zinc-200 transition-all"
            >
              <MessageSquare size={14} fill="black" /> Join Discord
            </button>
            <button
              onClick={() => window.open("https://linktr.ee/whxres")}
              className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl font-black uppercase text-[10px] tracking-widest hover:bg-white/10 transition-all"
            >
              <ExternalLink size={14} /> Linktree
            </button>
          </div>
        </div>
      </section>

      {/* 3. Grid Section */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CARD_VIDEOS.map((video, i) => (
            <div key={i} className="group">
              <div
                className={`relative aspect-[4/5] md:aspect-video rounded-[2.5rem] overflow-hidden border border-white/5 bg-zinc-900 transition-all duration-500 group-hover:border-white/40 group-hover:-translate-y-2 ${
                  !allowed ? "opacity-0" : "opacity-100"
                }`}
              >
                <video
                  ref={(el) => {
                    cardRefs.current[i] = el;
                  }}
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  className="w-full h-full object-cover opacity-40 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000"
                  src={video}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                <div className="absolute bottom-8 left-8 right-8">
                  <div className="flex items-center gap-2 mb-2">
                    <Globe size={12} className="text-white/20" />
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/80">
                      {CARD_CONTENT[i].title}
                    </h3>
                  </div>
                  <p className="text-[10px] text-white/30 leading-relaxed font-medium line-clamp-2 uppercase">
                    {CARD_CONTENT[i].description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="py-20 text-center border-t border-white/5">
        <p className="text-[9px] font-black uppercase tracking-[0.6em] text-white/10 italic">
          Premium Digital Feed • Established 2021
        </p>
      </footer>
    </main>
  );
}
