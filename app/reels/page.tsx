"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { AlertTriangle, Zap, Loader2 } from "lucide-react";

// Use your actual Google Sheet CSV link
const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSDX2H650gQIW6WPJOvdNCCFEgpOAcffU--nx3FLW2l-iGqcfJrEUDr4kdMqMhhPZrSlFXrk6mqo7Ek/pub?gid=0&single=true&output=csv";

export default function Reels() {
  const [videos, setVideos] = useState<string[]>([]);
  const [hasMounted, setHasMounted] = useState(false);
  const [allowed, setAllowed] = useState(false);
  const [isControlsOpen, setIsControlsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto-Pilot States
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const [scrollInterval, setScrollInterval] = useState(10);
  const [progress, setProgress] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // --- 1. MOUNT & DATA FETCH ---
  useEffect(() => {
    setHasMounted(true);
    const isAuth = localStorage.getItem("whxres-auth");
    if (isAuth === "true") setAllowed(true);

    const fetchSheetData = async () => {
      try {
        // Cache busting with timestamp
        const response = await fetch(`${CSV_URL}&t=${Date.now()}`);
        const csvText = await response.text();
        
        // Robust CSV split: Handles different line endings and trims whitespace
        const rows = csvText.split(/\r?\n/).filter((row) => row.trim() !== "");
        
        const rawUrls = rows
          .slice(1) // Skip "Video URL" header
          .map((row) => {
            // Take the first column, remove quotes, and trim
            return row.split(",")[0].replace(/["']/g, "").trim();
          })
          .filter((url) => url.startsWith("http"));

        if (rawUrls.length > 0) {
          setVideos(rawUrls.sort(() => Math.random() - 0.5));
        }
      } catch (error) {
        console.error("Failed to load spreadsheet:", error);
      }
    };
    fetchSheetData();
  }, []);

  // --- 2. AUTOPILOT ENGINE ---
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isAutoScrolling && allowed) {
      timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            containerRef.current?.scrollBy({
              top: window.innerHeight,
              behavior: "smooth",
            });
            return 0;
          }
          return prev + (100 / (scrollInterval * 10));
        });
      }, 100);
    } else {
      setProgress(0);
    }
    return () => clearInterval(timer);
  }, [isAutoScrolling, allowed, scrollInterval]);

  // --- 3. INTERSECTION OBSERVER ---
  useEffect(() => {
    if (!allowed || !hasMounted || videos.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = Number(entry.target.getAttribute("data-index"));
          const video = entry.target as HTMLVideoElement;
          
          if (entry.isIntersecting) {
            setActiveIndex(index);
            video.play().catch(() => {});
            setProgress(0); 
          } else {
            video.pause();
          }
        });
      },
      { root: containerRef.current, threshold: 0.6 }
    );

    videoRefs.current.forEach((v) => v && observer.observe(v));
    return () => observer.disconnect();
  }, [allowed, hasMounted, videos]);

  // --- 4. KEYBOARD NAV ---
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!allowed || !containerRef.current) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        containerRef.current.scrollBy({ top: window.innerHeight, behavior: "smooth" });
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        containerRef.current.scrollBy({ top: -window.innerHeight, behavior: "smooth" });
      }
    },
    [allowed]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  if (!hasMounted) return null;

  return (
    <main className="h-screen w-full bg-black text-white flex flex-col overflow-hidden font-sans select-none">
      
      {/* HUD: Autopilot Toggle */}
      {allowed && (
        <button
          onClick={() => setIsControlsOpen(true)}
          className="fixed left-6 top-6 z-[60] p-4 rounded-full bg-white/5 border border-white/10 backdrop-blur-2xl hover:bg-white/10 transition-all active:scale-90"
        >
          <Zap size={18} className={isAutoScrolling ? "text-yellow-400 fill-yellow-400" : "text-white/20"} />
        </button>
      )}

      {/* FEED */}
      <section
        ref={containerRef}
        className={`flex-1 snap-y snap-mandatory scrollbar-hide ${allowed ? "overflow-y-scroll" : "overflow-hidden"}`}
      >
        {videos.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center gap-4">
            <Loader2 className="animate-spin text-white/10" size={32} />
            <p className="text-[10px] tracking-[0.5em] text-white/20 uppercase font-black">Syncing Stream</p>
          </div>
        ) : (
          videos.map((url, i) => {
            const isNear = Math.abs(i - activeIndex) <= 1;
            return (
              <div key={i} className="w-full h-screen snap-start flex items-center justify-center relative bg-black">
                <div className="relative w-full max-w-[460px] h-full md:h-[94vh] md:rounded-[2.5rem] overflow-hidden bg-zinc-950 shadow-2xl">
                  
                  {/* Progress Indicator */}
                  {isAutoScrolling && i === activeIndex && (
                    <div className="absolute top-0 left-0 right-0 h-1 z-[60] bg-white/5">
                      <div className="h-full bg-white transition-all ease-linear" style={{ width: `${progress}%` }} />
                    </div>
                  )}

                  <video
                    ref={(el) => { videoRefs.current[i] = el; }}
                    data-index={i}
                    // FIXED: Pass undefined instead of empty string
                    src={allowed && isNear ? url : undefined}
                    loop
                    muted
                    playsInline
                    preload={isNear ? "auto" : "none"}
                    className={`w-full h-full object-cover transition-opacity duration-1000 ${!allowed ? "blur-3xl opacity-20" : "opacity-100"}`}
                  />

                  {/* Verification Overlay */}
                  {!allowed && i === 0 && (
                    <div className="absolute inset-0 z-[70] flex flex-col items-center justify-center p-12 bg-black/40 backdrop-blur-2xl">
                      <AlertTriangle size={40} className="text-white/10 mb-6" />
                      <h2 className="text-2xl font-black italic tracking-tighter uppercase mb-8 text-center">Verification Required</h2>
                      <button
                        onClick={() => { localStorage.setItem("whxres-auth", "true"); setAllowed(true); }}
                        className="w-full py-5 rounded-2xl bg-white text-black font-black uppercase text-[10px] tracking-widest active:scale-95 transition-all"
                      >
                        Enter Archive
                      </button>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>
            );
          })
        )}
      </section>

      {/* SETTINGS MODAL */}
      {isControlsOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-xs p-8 rounded-[2.5rem] bg-zinc-900 border border-white/10 shadow-2xl">
            <h4 className="text-[10px] font-black uppercase tracking-widest mb-8 text-white/30 text-center">Settings</h4>
            <div className="space-y-6">
              <div className="flex flex-col gap-3">
                <label className="text-[9px] uppercase font-bold text-white/40 tracking-wider">Scroll Speed: {scrollInterval}s</label>
                <input
                  type="range" min="3" max="30"
                  value={scrollInterval}
                  onChange={(e) => setScrollInterval(Number(e.target.value))}
                  className="w-full accent-white"
                />
              </div>
              <button
                onClick={() => { setIsAutoScrolling(!isAutoScrolling); setIsControlsOpen(false); }}
                className={`w-full py-4 rounded-2xl font-black text-[10px] tracking-widest transition-all ${isAutoScrolling ? "bg-red-500 text-white" : "bg-white text-black"}`}
              >
                {isAutoScrolling ? "STOP AUTOPILOT" : "START AUTOPILOT"}
              </button>
              <button onClick={() => setIsControlsOpen(false)} className="w-full text-[9px] opacity-20 uppercase font-bold tracking-widest">Close</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}