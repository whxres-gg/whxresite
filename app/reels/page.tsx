"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  AlertTriangle,
  ChevronRight,
  Clock,
  Timer,
  Play,
  Pause,
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

  // Auto-Pilot States
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const [scrollInterval, setScrollInterval] = useState(10);
  const [totalDuration, setTotalDuration] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [progress, setProgress] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // --- 1. CORE ENGINE: DATA FETCHING ---
  useEffect(() => {
    const fetchSheetData = async () => {
      if (!CSV_URL) return setHasMounted(true);
      try {
        const cacheBuster = `&t=${new Date().getTime()}`;
        const response = await fetch(CSV_URL + cacheBuster);
        const csvText = await response.text();
        const rows = csvText.split(/\r?\n/).filter((row) => row.trim() !== "");
        const rawUrls = rows
          .slice(1)
          .map((row) => row.split(",")[0].replace(/"/g, "").trim())
          .filter((url) => url.startsWith("http"));

        const shuffled = [...rawUrls];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        setVideos(shuffled);
      } catch (error) {
        console.error("Manifest Error");
      } finally {
        setHasMounted(true);
      }
    };
    fetchSheetData();
  }, []);

  // --- 2. CONTROLS: KEYBOARD ---
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!allowed) return;
      const container = containerRef.current;
      if (!container) return;
      const activeIndex = Math.round(container.scrollTop / window.innerHeight);
      const activeVideo = videoRefs.current[activeIndex];

      if (e.key === "ArrowDown") {
        e.preventDefault();
        container.scrollBy({ top: window.innerHeight, behavior: "smooth" });
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        container.scrollBy({ top: -window.innerHeight, behavior: "smooth" });
      } else if (e.key === " " || e.code === "Space") {
        e.preventDefault();
        if (activeVideo) {
          activeVideo.paused
            ? activeVideo.play().catch(() => {})
            : activeVideo.pause();
        }
      }
    },
    [allowed],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // --- 3. AUTO-PILOT ENGINE ---
  useEffect(() => {
    let scrollTimer: NodeJS.Timeout;
    let lifeTimer: NodeJS.Timeout;
    let progressTimer: NodeJS.Timeout;

    if (isAutoScrolling && allowed) {
      setProgress(0);
      progressTimer = setInterval(() => {
        setProgress((prev) =>
          prev >= 100 ? 0 : prev + 100 / (scrollInterval * 10),
        );
      }, 100);

      scrollTimer = setInterval(() => {
        containerRef.current?.scrollBy({
          top: window.innerHeight,
          behavior: "smooth",
        });
        setProgress(0);
      }, scrollInterval * 1000);

      if (totalDuration > 0) {
        setTimeLeft(totalDuration * 60);
        lifeTimer = setInterval(() => {
          setTimeLeft((prev) => {
            if (prev <= 1) {
              setIsAutoScrolling(false);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    } else {
      setProgress(0);
    }
    return () => {
      clearInterval(scrollTimer);
      clearInterval(lifeTimer);
      clearInterval(progressTimer);
    };
  }, [isAutoScrolling, scrollInterval, totalDuration, allowed]);

  // --- 4. INTERSECTION OBSERVER ---
  useEffect(() => {
    if (!allowed || !hasMounted || videos.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target instanceof HTMLVideoElement) {
            if (entry.isIntersecting) {
              entry.target.play().catch(() => {});
              setShowToast(
                videoRefs.current.indexOf(entry.target) === videos.length - 1,
              );
            } else {
              entry.target.pause();
              entry.target.currentTime = 0;
            }
          }
          if (entry.target === sentinelRef.current && entry.isIntersecting) {
            containerRef.current?.scrollTo({ top: 0, behavior: "instant" });
          }
        });
      },
      { root: containerRef.current, threshold: 0.6 },
    );
    videoRefs.current.forEach((v) => v && observer.observe(v));
    if (sentinelRef.current) observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [allowed, hasMounted, videos]);

  if (!hasMounted)
    return (
      <div className="h-dvh bg-black flex flex-col items-center justify-center gap-4 text-white">
        <div className="w-12 h-[1px] bg-white/10 overflow-hidden relative">
          <div className="absolute inset-0 bg-white animate-pulse" />
        </div>
        <p className="text-[10px] tracking-[0.5em] opacity-20 uppercase">
          Syncing Manifest
        </p>
      </div>
    );

  return (
    <main className="h-dvh bg-black text-white flex flex-col overflow-hidden font-sans select-none">
      {/* 1. ULTRA-SLIM SIDE TAB */}
      {allowed && (
        <>
          <button
            onClick={() => setIsControlsOpen(true)}
            className={`fixed left-0 top-1/2 -translate-y-1/2 z-[60] flex flex-col items-center py-0.1 px-2 w-2 rounded-r-sm  bg-white/5 border border-l-0 border-white/10 backdrop-blur-md transition-all duration-300 hover:bg-white/10 ${isControlsOpen ? "opacity-0 -translate-x-full" : "opacity-100"}`}
          >
            <Zap
              size={10}
              className={`mb-3 ${isAutoScrolling ? "text-yellow-400 fill-yellow-400" : "text-white/40"}`}
            />
            <span className="text-[8px] font-bold uppercase tracking-[0.2em] [writing-mode:vertical-lr] rotate-180 opacity-40">
              AUTOPILOT
            </span>
          </button>

          {/* Slim Control Drawer */}
          <div
            className={`fixed left-4 top-1/2 -translate-y-1/2 z-[70] transition-all duration-500 ease-out ${isControlsOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8 pointer-events-none"}`}
          >
            <div className="relative p-5 rounded-[2rem] bg-zinc-900/90 border border-white/10 backdrop-blur-2xl shadow-2xl w-48">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2 opacity-30">
                  <Settings2 size={12} />
                  <h4 className="text-[9px] font-black uppercase tracking-widest">
                    Setup
                  </h4>
                </div>
                <button
                  onClick={() => setIsControlsOpen(false)}
                  className="opacity-40 hover:opacity-100 transition-opacity"
                >
                  <ChevronRight size={14} className="rotate-180" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[8px] uppercase tracking-tighter font-bold opacity-30 flex items-center gap-1.5">
                    <RotateCcw size={8} /> SECONDS
                  </label>
                  <input
                    type="number"
                    value={scrollInterval}
                    onChange={(e) =>
                      setScrollInterval(Math.max(3, Number(e.target.value)))
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-[10px] outline-none focus:border-white/20"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[8px] uppercase tracking-tighter font-bold opacity-30 flex items-center gap-1.5">
                    <Clock size={8} /> MINUTES
                  </label>
                  <input
                    type="number"
                    placeholder="∞"
                    onChange={(e) => setTotalDuration(Number(e.target.value))}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-[10px] outline-none focus:border-white/20"
                  />
                </div>

                <button
                  onClick={() => {
                    setIsAutoScrolling(!isAutoScrolling);
                    setTimeout(() => setIsControlsOpen(false), 300);
                  }}
                  className={`w-full py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                    isAutoScrolling
                      ? "bg-red-500/20 text-red-400 border border-red-500/30"
                      : "bg-white text-black shadow-lg"
                  }`}
                >
                  {isAutoScrolling ? "STOP" : "ENGAGE"}
                </button>
              </div>
            </div>
          </div>

          {/* Interaction Guard */}
          {isControlsOpen && (
            <div
              className="fixed inset-0 z-[65] bg-black/10 backdrop-blur-[2px]"
              onClick={() => setIsControlsOpen(false)}
            />
          )}
        </>
      )}

      {/* 2. FEED CONTAINER */}
      <section
        ref={containerRef}
        className={`flex-1 snap-y snap-mandatory scrollbar-hide ${allowed ? "overflow-y-scroll" : "overflow-hidden"}`}
      >
        {videos.map((video, i) => (
          <div
            key={i}
            className="w-full h-dvh snap-start flex items-center justify-center sm:p-4"
          >
            <div className="relative w-full max-w-[420px] h-full sm:h-[88dvh] rounded-none sm:rounded-[3rem] overflow-hidden bg-zinc-950 border-white/10 shadow-2xl">
              {isAutoScrolling && (
                <div className="absolute top-12 left-12 right-12 h-[1px] bg-white/10 z-20 overflow-hidden">
                  <div
                    className="h-full bg-white/40 transition-all duration-100 ease-linear"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}

              <video
                ref={(el) => {
                  videoRefs.current[i] = el;
                }}
                src={video}
                loop
                muted
                playsInline
                className={`w-full h-full object-cover transition-all duration-1000 ${
                  !allowed
                    ? "blur-[100px] scale-125 opacity-20"
                    : "blur-0 scale-100 opacity-100"
                }`}
              />

              {!allowed && i === 0 && (
                <div className="absolute inset-0 z-50 flex flex-col items-center justify-center p-10 backdrop-blur-2xl">
                  <div className="mb-6 w-16 h-16 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/80">
                    <AlertTriangle size={24} />
                  </div>
                  <h2 className="text-2xl font-black italic tracking-tighter uppercase mb-2">
                    Sexual Content
                  </h2>
                  <p className="text-[8px] text-white/30 uppercase tracking-[0.4em] mb-10 text-center">
                    Verify Legal Age
                  </p>
                  <button
                    onClick={() => setAllowed(true)}
                    className="w-full py-4 rounded-xl bg-white text-black font-black uppercase text-[10px] tracking-[0.2em] active:scale-95 transition-transform"
                  >
                    Enter Feed
                  </button>
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-8 left-8 pointer-events-none select-none">
                <p
                  className="text-xl font-black tracking-tighter italic opacity-10"
                  style={{
                    WebkitTextStroke: "1px white",
                    color: "transparent",
                  }}
                >
                  @WHXRES
                </p>
              </div>
            </div>
          </div>
        ))}
        <div ref={sentinelRef} className="h-20 snap-start" />
      </section>

      {/* 3. TOAST */}
      <div
        className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 transition-all duration-700 ${
          showToast || isAutoScrolling
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10"
        }`}
      >
        <div className="px-6 py-3 rounded-full bg-zinc-900/80 border border-white/10 backdrop-blur-xl text-[8px] uppercase tracking-[0.4em] font-black flex items-center gap-3">
          {isAutoScrolling && <Timer size={10} className="animate-spin" />}
          {isAutoScrolling
            ? `${Math.floor(timeLeft / 60)}m ${timeLeft % 60}s`
            : "RANDOMIZED"}
        </div>
      </div>
    </main>
  );
}
