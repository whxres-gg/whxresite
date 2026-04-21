"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, Skull, Link2 } from "lucide-react";

const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSDX2H650gQIW6WPJOvdNCCFEgpOAcffU--nx3FLW2l-iGqcfJrEUDr4kdMqMhhPZrSlFXrk6mqo7Ek/pub?gid=0&single=true&output=csv";

export default function Reels() {
  const [videos, setVideos] = useState<string[]>([]);
  const [hasMounted, setHasMounted] = useState(false);
  const [allowed, setAllowed] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const pressTimer = useRef<NodeJS.Timeout | null>(null);

  // --- 1. DATA LOAD & COMPLEX SORT ---
  useEffect(() => {
    setHasMounted(true);
    if (localStorage.getItem("whxres-auth") === "true") setAllowed(true);

    fetch(`${CSV_URL}&t=${Date.now()}`)
      .then(res => res.text())
      .then(csv => {
        const urls = csv.split(/\r?\n/).slice(1)
          .map(row => row.split(",")[0].replace(/["']/g, "").trim())
          .filter(url => url.startsWith("http"));
        
        // Sorting: Group MP4s vs Third Party and interleave them for pacing
        const mp4s = urls.filter(u => u.toLowerCase().endsWith('.mp4')).sort(() => Math.random() - 0.5);
        const others = urls.filter(u => !u.toLowerCase().endsWith('.mp4')).sort(() => Math.random() - 0.5);
        const shuffled = [];
        while(mp4s.length || others.length) {
          if(mp4s.length) shuffled.push(mp4s.pop()!);
          if(others.length) shuffled.push(others.pop()!);
        }
        setVideos(shuffled);
      });
  }, []);

  // --- 2. CLIPBOARD ENGINE (Universal Mobile/Desktop) ---
  const copyToClipboard = (text: string) => {
    const triggerUI = () => { setCopied(true); setTimeout(() => setCopied(false), 2000); };
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(triggerUI).catch(() => fallbackCopy(text, triggerUI));
    } else {
      fallbackCopy(text, triggerUI);
    }
  };

  const fallbackCopy = (text: string, cb: () => void) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try { document.execCommand('copy'); cb(); } catch (err) {}
    document.body.removeChild(textArea);
  };

  const startPress = (url: string) => { pressTimer.current = setTimeout(() => copyToClipboard(url), 800); };
  const endPress = () => { if (pressTimer.current) clearTimeout(pressTimer.current); };

  // --- 3. SCROLL OBSERVER ---
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          const video = entry.target as HTMLVideoElement;
          const idx = Number(video.dataset.index);
          if (entry.isIntersecting) {
            video.play().catch(() => {});
            setActiveIndex(idx);
          } else {
            video.pause();
            video.currentTime = 0;
          }
        });
      },
      { root: containerRef.current, threshold: 0.6 }
    );
    videoRefs.current.forEach(v => v && observer.observe(v));
    return () => observer.disconnect();
  }, [videos, allowed]);

  if (!hasMounted) return null;

  return (
    <main className="h-screen w-full bg-black text-white overflow-hidden select-none relative font-sans">
      
      {/* HUD: STATUS NOTIFICATION */}
      {copied && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[200] bg-white text-black px-6 py-2 rounded-full flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-300 shadow-2xl">
          <Link2 size={12} />
          <span className="text-[9px] font-black uppercase tracking-[0.2em]">Source Manifested</span>
        </div>
      )}

      {/* FEED */}
      <section
        ref={containerRef}
        className="h-full w-full snap-y snap-mandatory overflow-y-scroll scroll-smooth scrollbar-hide"
      >
        {videos.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <Loader2 className="animate-spin text-white/5" size={32} />
          </div>
        ) : (
          videos.map((url, i) => (
            <div 
              key={i} 
              className="w-full h-screen snap-start flex items-center justify-center bg-black relative"
              onMouseDown={() => startPress(url)}
              onMouseUp={endPress}
              onTouchStart={() => startPress(url)}
              onTouchEnd={endPress}
            >
              {/* 9:16 VERTICAL ASPECT FRAME */}
              <div className="relative h-full aspect-[9/16] bg-[#030303] overflow-hidden border-x border-white/5">
                
                <video
                  ref={el => { videoRefs.current[i] = el; }}
                  data-index={i}
                  src={(allowed && Math.abs(i - activeIndex) <= 1) ? url : undefined}
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />

                {/* VISUAL OVERLAYS */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none z-10" />

                {/* GOTH ACCENTS */}
                <div className="absolute bottom-10 left-10 z-20 flex flex-col items-center gap-4 opacity-10">
                   <Skull size={18} />
                   <div className="w-[1px] h-16 bg-gradient-to-b from-white to-transparent" />
                </div>

                {/* GATEWAY */}
                {!allowed && i === 0 && (
                  <div className="absolute inset-0 z-[100] bg-black flex flex-col items-center justify-center p-12 text-center">
                    <Skull size={48} className="text-white/5 mb-12 animate-pulse" />
                    <button 
                      onClick={() => { localStorage.setItem("whxres-auth", "true"); setAllowed(true); }}
                      className="w-full py-5 border border-white/10 text-[10px] font-black uppercase tracking-[0.5em] hover:bg-white hover:text-black transition-all active:scale-95"
                    >
                      Enter
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </section>
    </main>
  );
}