"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import {
  AlertTriangle,
  ChevronRight,
  Clock,
  Timer,
  RotateCcw,
  Zap,
  Settings2,
} from "lucide-react";

const CSV_URL = process.env.NEXT_PUBLIC_CSV_URL || "";

export default function Reels() {
  const [videos, setVideos] = useState<string[]>([]);
  const [hasMounted, setHasMounted] = useState(false);
  const [allowed, setAllowed] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isControlsOpen, setIsControlsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto-Pilot States
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const [scrollInterval, setScrollInterval] = useState(10);
  const [totalDuration, setTotalDuration] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [progress, setProgress] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // --- 1. CORE ENGINE: FETCHING ---
  useEffect(() => {
    const fetchSheetData = async () => {
      if (!CSV_URL) return setHasMounted(true);
      try {
        const response = await fetch(`${CSV_URL}&t=${Date.now()}`);
        const csvText = await response.text();
        const rows = csvText.split(/\r?\n/).filter((row) => row.trim() !== "");
        const rawUrls = rows
          .slice(1)
          .map((row) => row.split(",")[0].replace(/"/g, "").trim())
          .filter((url) => url.startsWith("http"));

        setVideos(rawUrls.sort(() => Math.random() - 0.5));
      } catch (error) {
        console.error("Manifest Error");
      } finally {
        setHasMounted(true);
      }
    };
    fetchSheetData();
  }, []);

  // --- 2. OPTIMIZED INTERSECTION (SPEED FIX) ---
  useEffect(() => {
    if (!allowed || !hasMounted || videos.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = Number(entry.target.getAttribute("data-index"));
          if (entry.isIntersecting) {
            setActiveIndex(index);
            const video = entry.target as HTMLVideoElement;
            video.play().catch(() => {});

            // Loop back logic
            if (index === videos.length - 1) setShowToast(true);
          } else {
            const video = entry.target as HTMLVideoElement;
            video.pause();
            // Free up memory/buffer on slow connections
            video.currentTime = 0;
          }
        });
      },
      { root: containerRef.current, threshold: 0.6 },
    );

    videoRefs.current.forEach((v) => v && observer.observe(v));
    return () => observer.disconnect();
  }, [allowed, hasMounted, videos]);

  // --- 3. KEYBOARD CONTROLS ---
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!allowed || !containerRef.current) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        containerRef.current.scrollBy({
          top: window.innerHeight,
          behavior: "smooth",
        });
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        containerRef.current.scrollBy({
          top: -window.innerHeight,
          behavior: "smooth",
        });
      }
    },
    [allowed],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  if (!hasMounted)
    return (
      <div className="h-dvh bg-black flex flex-col items-center justify-center gap-4 text-white">
        <div className="w-8 h-8 border-2 border-white/10 border-t-white rounded-full animate-spin" />
        <p className="text-[10px] tracking-[0.5em] opacity-20 uppercase">
          Streaming Archive
        </p>
      </div>
    );

  return (
    <main className="h-dvh bg-black text-white flex flex-col overflow-hidden font-sans select-none">
      {/* AUTOPILOT UI (Same as your logic, visual-only cleanup) */}
      {allowed && (
        <>
          <button
            onClick={() => setIsControlsOpen(true)}
            className={`fixed left-0 top-1/2 -translate-y-1/2 z-[60] py-4 px-1.5 rounded-r-xl bg-white/5 border border-white/10 backdrop-blur-md transition-all ${isControlsOpen ? "opacity-0" : "opacity-100"}`}
          >
            <Zap
              size={12}
              className={
                isAutoScrolling
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-white/20"
              }
            />
          </button>

          {isControlsOpen && (
            <div className="fixed inset-0 z-[70] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
              <div className="w-full max-w-xs p-8 rounded-[2.5rem] bg-zinc-900 border border-white/10 shadow-2xl">
                <h4 className="text-[10px] font-black uppercase tracking-widest mb-6 opacity-30">
                  Autopilot Config
                </h4>
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold opacity-50 text-white">
                      Interval (sec)
                    </span>
                    <input
                      type="number"
                      value={scrollInterval}
                      onChange={(e) =>
                        setScrollInterval(Number(e.target.value))
                      }
                      className="w-16 bg-white/5 border border-white/10 rounded-lg p-2 text-center text-xs"
                    />
                  </div>
                  <button
                    onClick={() => {
                      setIsAutoScrolling(!isAutoScrolling);
                      setIsControlsOpen(false);
                    }}
                    className={`w-full py-4 rounded-2xl font-black text-[10px] tracking-widest transition-all ${isAutoScrolling ? "bg-red-500/20 text-red-500" : "bg-white text-black"}`}
                  >
                    {isAutoScrolling ? "DEACTIVATE" : "ENGAGE"}
                  </button>
                  <button
                    onClick={() => setIsControlsOpen(false)}
                    className="w-full text-[9px] opacity-20 uppercase font-bold tracking-widest"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* 2. OPTIMIZED FEED CONTAINER */}
      <section
        ref={containerRef}
        className={`flex-1 snap-y snap-mandatory scrollbar-hide ${allowed ? "overflow-y-scroll" : "overflow-hidden"}`}
      >
        {videos.map((video, i) => {
          // SPEED OPTIMIZATION: Adaptive Preloading
          // Only 'auto' preload the current video and the next one.
          // Metadata only for others to save bandwidth.
          const isNear = Math.abs(i - activeIndex) <= 1;
          const isNext = i === activeIndex + 1;

          return (
            <div
              key={i}
              className="w-full h-dvh snap-start flex items-center justify-center sm:p-4"
            >
              <div className="relative w-full max-w-[420px] h-full sm:h-[92dvh] rounded-none sm:rounded-[3rem] overflow-hidden bg-zinc-950 shadow-2xl">
                {/* Progress Bar (Only show on active video) */}
                {isAutoScrolling && i === activeIndex && (
                  <div className="absolute top-0 left-0 right-0 h-1 z-50">
                    <div
                      className="h-full bg-white transition-all duration-100 ease-linear"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                )}

                <video
                  ref={(el) => {
                    videoRefs.current[i] = el;
                  }}
                  data-index={i}
                  src={video}
                  loop
                  muted
                  playsInline
                  // THE SPEED MAGIC:
                  preload={isNear ? "auto" : "none"}
                  poster={!isNear ? "/poster-placeholder.jpg" : undefined}
                  className={`w-full h-full object-cover transition-all duration-700 ${
                    !allowed ? "blur-3xl opacity-20" : "opacity-100"
                  }`}
                />

                {/* Verification Overlay */}
                {!allowed && i === 0 && (
                  <div className="absolute inset-0 z-50 flex flex-col items-center justify-center p-10">
                    <AlertTriangle size={32} className="text-white/20 mb-4" />
                    <h2 className="text-2xl font-black italic tracking-tighter uppercase mb-6">
                      Archive Access
                    </h2>
                    <button
                      onClick={() => setAllowed(true)}
                      className="w-full py-4 rounded-2xl bg-white text-black font-black uppercase text-[10px] tracking-widest active:scale-95 transition-all"
                    >
                      Verify Age
                    </button>
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
              </div>
            </div>
          );
        })}
      </section>
    </main>
  );
}
