"use client";

import { useEffect, useRef, useState } from "react";
import { ShieldAlert, MessageSquare, ExternalLink, Flame, Cross, Users, Zap, Terminal, Lock } from "lucide-react";

const HERO_VIDEO = "https://sfmcompile.club/wp-content/uploads/2026/01/Mercy-in-lingerie-giving-a-buttjob.mp4";
const CARD_VIDEOS = [
  "https://v.redd.it/hq4ydybusodg1/CMAF_480.mp4",
  "https://v.redd.it/78qdq6yi82fg1/CMAF_480.mp4",
  "https://sfmcompile.club/wp-content/uploads/2025/11/Lara-Croft-bending-over-for-pleasure-Extended.mp4",
];

const CARD_CONTENT = [
  { title: "The Flesh", description: "Raw Pornography" },
  { title: "The Ink", description: "Curated 2D Hentai" },
  { title: "The Ghost", description: "High-Fidelity SFM Videos" },
];

export default function Home() {
  const [hasMounted, setHasMounted] = useState(false);
  const [allowed, setAllowed] = useState(false);
  const heroRef = useRef<HTMLVideoElement>(null);
  const cardRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // --- GHOST MODE LOGIC (Left Shift) ---
  useEffect(() => {
    const handleGhost = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.code === "ShiftLeft") {
        window.location.href = "https://www.indeed.com/jobs?q=software+engineer&l=Remote";
      }
    };
    window.addEventListener("keydown", handleGhost);
    return () => window.removeEventListener("keydown", handleGhost);
  }, []);

  useEffect(() => {
    setHasMounted(true);
    if (localStorage.getItem("whxres-auth") === "true") setAllowed(true);
  }, []);

  useEffect(() => {
    if (allowed && hasMounted) {
      const play = () => {
        heroRef.current?.play().catch(() => {});
        cardRefs.current.forEach((v) => v?.play().catch(() => {}));
      };
      play();
      setTimeout(play, 1000);
    }
  }, [allowed, hasMounted]);

  if (!hasMounted) return <div className="min-h-screen bg-black" />;

  return (
    <main className="min-h-screen bg-[#010101] text-white selection:bg-white/20 font-sans overflow-x-hidden relative">
      
      <style jsx global>{`
        @keyframes horror-flicker {
          0% { opacity: 1; }
          2% { opacity: 0.1; }
          4% { opacity: 1; }
          19% { opacity: 1; }
          20% { opacity: 0.4; }
          21% { opacity: 1; }
          60% { opacity: 1; }
          61% { opacity: 0.2; }
          62% { opacity: 1; }
          100% { opacity: 1; }
        }
        .flicker { animation: horror-flicker 6s infinite step-end; }
        .text-outline {
          -webkit-text-stroke: 1.5px rgba(255, 255, 255, 0.4);
          color: transparent;
          transition: -webkit-text-stroke 0.5s;
        }
        .text-outline:hover { -webkit-text-stroke: 1.5px rgba(255, 255, 255, 0.8); }
      `}</style>

      {/* 1. BACKGROUND: SCALED TATTOO & DARK OVERLAY */}
      <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute inset-0 flex justify-center items-center opacity-[0.15]">
            <img 
                src="/tattoo.png" 
                alt="" 
                className="w-full h-full object-cover scale-110" 
            />
          </div>
          <div className="absolute inset-0 bg-black/80 backdrop-blur-[2px]" />
      </div>

      {/* 2. VERIFICATION GATE */}
      {!allowed && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/98 backdrop-blur-3xl">
          <div className="max-w-md w-full mx-4 p-12 text-center border border-white/5 bg-[#050505] shadow-2xl">
            <ShieldAlert size={40} className="mx-auto mb-6 text-red-900 opacity-50" />
            <h2 className="text-xl font-light uppercase tracking-[0.5em] mb-4 text-red-900">Maturity Required</h2>
            <p className="text-[9px] text-white/20 uppercase tracking-widest mb-10">Accessing restricted digital rituals</p>
            <button 
                onClick={() => { localStorage.setItem("whxres-auth", "true"); setAllowed(true); }} 
                className="w-full py-4 bg-white text-black text-[10px] font-black uppercase tracking-[0.4em] active:scale-95 transition-all"
            >
              Enter Sanctum
            </button>
          </div>
        </div>
      )}

      {/* 3. MAIN INTERFACE */}
      <div className="relative z-10 flex flex-col items-center">
        
        {/* HEADER: OUTLINE & FLICKER */}
        <section className="pt-20 pb-10 px-6 flex flex-col items-center w-full flicker">
          <h1 className="text-[8px] uppercase tracking-[2.5em] text-white/20 font-black mb-3">Since 2021</h1>
          <h2 className="text-7xl md:text-[10rem] font-black tracking-tighter leading-none italic text-outline uppercase">
            WHXRES
          </h2>
          <div className="flex items-center justify-center gap-3 text-white/10 mt-4">
            <div className="h-[1px] w-16 bg-current" />
            <Flame size={14} />
            <div className="h-[1px] w-16 bg-current" />
          </div>
        </section>

        {/* HERO: VIDEO ALTAR */}
        <section className="w-full max-w-5xl px-6 mb-16">
          <div className={`relative aspect-video rounded-sm overflow-hidden bg-black border border-white/5 transition-all duration-1000 ${!allowed ? "blur-3xl opacity-0" : "opacity-100"}`}>
            <video 
                ref={heroRef} 
                src={allowed ? HERO_VIDEO : undefined} 
                loop muted playsInline autoPlay 
                className="w-full h-full object-cover opacity-90 transition-opacity" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#010101] via-transparent to-transparent" />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <button 
                    onClick={() => window.open("https://discord.gg/X7KRfEeHWS")} 
                    className="flex items-center gap-5 px-12 py-5 bg-white text-black hover:invert transition-all font-black uppercase text-[11px] tracking-[0.3em] shadow-[0_0_60px_rgba(255,255,255,0.15)]"
                >
                    <MessageSquare size={16} fill="black" /> Join Discord
                </button>
            </div>
          </div>
        </section>

        {/* GRID: 3-COLUMN COLOR CONTENT */}
        <section className="w-full max-w-6xl px-6 mb-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CARD_VIDEOS.map((video, i) => (
              <div key={i} className="group relative aspect-video bg-zinc-950 border border-white/5 overflow-hidden transition-all hover:border-white/20">
                <video 
                    ref={(el) => { cardRefs.current[i] = el; }} 
                    loop muted playsInline autoPlay 
                    src={allowed ? video : undefined} 
                    className="w-full h-full object-cover opacity-100 transition-transform duration-700 group-hover:scale-105" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/90">{CARD_CONTENT[i].title}</h3>
                    <p className="text-[8px] text-white/40 uppercase tracking-tighter mt-1">{CARD_CONTENT[i].description}</p>
                </div>
                <Cross size={12} className="absolute top-5 right-5 text-white/10 group-hover:text-white/40 group-hover:rotate-180 transition-all duration-700" />
              </div>
            ))}
          </div>
        </section>

        {/* DISCORD TERMINAL (NO IFRAME - BYPASSES BLOCK) */}
        <section className="w-full max-w-5xl px-6 pb-32">
            <div className="bg-white/[0.02] border border-white/5 rounded-sm overflow-hidden flex flex-col md:flex-row backdrop-blur-md">
                {/* Left: System Status */}
                <div className="flex-1 p-10 border-b md:border-b-0 md:border-r border-white/5">
                    <div className="flex items-center gap-3 mb-8">
                        <Terminal size={16} className="text-white/30" />
                        <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/60">System Status</h3>
                    </div>
                    <div className="space-y-6">
                        <div className="flex justify-between items-end border-b border-white/5 pb-2">
                            <span className="text-[9px] text-white/20 uppercase tracking-widest">Connection</span>
                            <span className="text-[10px] font-bold text-green-500 uppercase tracking-tighter flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> Operational
                            </span>
                        </div>
                        <div className="flex justify-between items-end border-b border-white/5 pb-2">
                            <span className="text-[9px] text-white/20 uppercase tracking-widest">Encryption</span>
                            <span className="text-[10px] font-bold text-white/60 uppercase tracking-tighter">Captcha</span>
                        </div>
                        <div className="flex justify-between items-end border-b border-white/5 pb-2">
                            <span className="text-[9px] text-white/20 uppercase tracking-widest">Server Created</span>
                            <span className="text-[10px] font-bold text-white/60 uppercase tracking-tighter">2021</span>
                        </div>
                    </div>
                </div>

                {/* Right: CTA Widget */}
                <div className="w-full md:w-[400px] p-10 bg-white/[0.01] flex flex-col justify-center">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                            <Users size={20} className="text-white/40" />
                        </div>
                        <div>
                            <h4 className="text-[11px] font-black uppercase tracking-widest">Discord Sanctum</h4>
                            <p className="text-[8px] text-green-500/50 uppercase font-bold tracking-widest mt-1">Live Access Enabled</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => window.open("https://discord.gg/X7KRfEeHWS")}
                        className="w-full py-4 bg-transparent border border-white/20 hover:bg-white hover:text-black transition-all text-[10px] font-black uppercase tracking-[0.3em]"
                    >
                        Enter Discord
                    </button>
                </div>
            </div>
        </section>

        {/* FOOTER */}
        <footer className="w-full py-20 text-center border-t border-white/5 relative overflow-hidden">
            <div className="flex flex-col items-center gap-8 relative z-10">
                <div className="flex gap-12">
                    <button onClick={() => window.open("https://linktr.ee/whxres")} className="text-[9px] uppercase tracking-[0.5em] text-white/20 hover:text-white transition-colors">Linktree</button>
                    <a href="https://trello.com/b/MqzSLQGN/whxres" target="_blank" className="text-[9px] uppercase tracking-[0.5em] text-white/20 hover:text-white transition-colors underline decoration-white/5 underline-offset-8">Terms of Sin</a>
                </div>
                <p className="text-[7px] text-white/5 uppercase tracking-[1.2em] italic">Sinning since 2021</p>
            </div>
        </footer>

      </div>

      {/* GHOST MODE UI HINT */}
      <div className="fixed bottom-6 right-6 z-[100] group">
          <div className="p-3 bg-white/[0.02] border border-white/0 hover:border-white/10 hover:bg-white/5 backdrop-blur-md rounded-full transition-all">
              <Lock size={12} className="text-white/10 group-hover:text-green-500/40" />
          </div>
      </div>

    </main>
  );
}