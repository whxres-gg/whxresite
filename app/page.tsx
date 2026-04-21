"use client";

import { useEffect, useRef, useState } from "react";
import { ShieldAlert, Globe, MessageSquare, ExternalLink } from "lucide-react";

const HERO_VIDEO = "https://sfmcompile.club/wp-content/uploads/2026/01/Mercy-in-lingerie-giving-a-buttjob.mp4";
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
    const isAuth = localStorage.getItem("whxres-auth") === "true";
    if (isAuth) {
      setAllowed(true);
    }
  }, []);

  useEffect(() => {
    if (allowed && hasMounted) {
      const timer = setTimeout(() => {
        heroRef.current?.play().catch(() => {});
        cardRefs.current.forEach((v) => v?.play().catch(() => {}));
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [allowed, hasMounted]);

  const accept = () => {
    localStorage.setItem("whxres-auth", "true");
    setAllowed(true);
  };

  if (!hasMounted) {
    return <div className="min-h-screen bg-[#050505]" />;
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-white selection:text-black font-sans overflow-x-hidden">
      {!allowed && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-[100px]">
          <div className="max-w-sm w-full mx-4 p-8 rounded-[3rem] border border-white/10 bg-zinc-900/50 text-center">
            <div className="mb-6 inline-flex p-5 rounded-full bg-red-500/10 text-red-500 animate-pulse">
              <ShieldAlert size={32} />
            </div>
            <h2 className="text-2xl font-black uppercase italic">Access Restricted</h2>
            <p className="text-white/40 text-xs mb-8">
              This digital archive contains explicit adult content. <br /> Are you 18 or older?
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={accept}
                className="w-full py-4 rounded-2xl bg-white text-black font-black uppercase text-xs tracking-widest hover:bg-zinc-200 transition-all"
              >
                Enter Archive
              </button>
              <button
                onClick={() => (window.location.href = "https://google.com")}
                className="w-full py-4 rounded-2xl border border-white/5 text-white/20 text-xs font-bold hover:text-white/50"
              >
                Exit
              </button>
            </div>
          </div>
        </div>
      )}

      <section className="relative pt-24 pb-10 px-6 flex flex-col items-center">
        <div className="text-center mb-12">
          <h1 className="text-[10px] uppercase tracking-[0.8em] text-white/10 font-black mb-4">Since 2021</h1>
          <h2
            className="text-7xl md:text-[9rem] font-black tracking-tighter italic select-none leading-none"
            style={{ WebkitTextStroke: "1px rgba(255,255,255,0.15)", color: "transparent" }}
          >
            WHXRES
          </h2>
        </div>

        <div className={`group relative w-full max-w-4xl aspect-video rounded-[2.5rem] overflow-hidden border border-white/10 bg-zinc-900 transition-all duration-1000 ${!allowed ? "blur-2xl opacity-0" : "opacity-100"}`}>
          <video
            ref={heroRef}
            src={allowed ? HERO_VIDEO : undefined}
            loop
            muted
            playsInline
            crossOrigin="anonymous" // FIX: Allows cross-origin loading under COEP
            className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
          <div className="absolute bottom-8 left-8 right-8 flex flex-wrap gap-4">
            <button onClick={() => window.open("https://discord.gg/X7KRfEeHWS")} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-black font-black uppercase text-[9px]">
              <MessageSquare size={12} fill="black" /> Join Discord
            </button>
            <button onClick={() => window.open("https://linktr.ee/whxres")} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 font-black uppercase text-[9px]">
              <ExternalLink size={12} /> Linktree
            </button>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CARD_VIDEOS.map((video, i) => (
            <div key={i} className="group">
              <div className={`relative aspect-video rounded-[2rem] overflow-hidden border border-white/5 bg-zinc-900 transition-all ${!allowed ? "opacity-0" : "opacity-100"}`}>
                <video
                  ref={(el) => { cardRefs.current[i] = el; }}
                  loop
                  muted
                  playsInline
                  crossOrigin="anonymous" // FIX: Allows cross-origin loading under COEP
                  src={allowed ? video : undefined}
                  className="w-full h-full object-cover opacity-40 group-hover:opacity-100 transition-all duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="text-[9px] font-black uppercase tracking-widest text-white/80">{CARD_CONTENT[i].title}</h3>
                  <p className="text-[9px] text-white/30 uppercase">{CARD_CONTENT[i].description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}