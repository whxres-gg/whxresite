"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { Loader2, X, Shuffle, Zap } from "lucide-react";

const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSDX2H650gQIW6WPJOvdNCCFEgpOAcffU--nx3FLW2l-iGqcfJrEUDr4kdMqMhhPZrSlFXrk6mqo7Ek/pub?gid=706542572&single=true&output=csv";

interface VideoData {
  url: string;
  category: string;
  id: string;
}

export default function CuratedGallery() {
  const [rawVideos, setRawVideos] = useState<VideoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [visibleIds, setVisibleIds] = useState<Set<string>>(new Set());

  // 1. DATA FETCH
  useEffect(() => {
    fetch(`${CSV_URL}&t=${Date.now()}`)
      .then(res => res.text())
      .then(csv => {
        const data = csv.split(/\r?\n/).slice(1).map(row => {
          const cols = row.split(",");
          const id = cols[0]?.split('/watch/')[1]?.split(/[#?]/)[0] || "";
          return { url: cols[0], category: cols[1]?.trim() || "Uncategorized", id };
        }).filter(v => v.id);
        setRawVideos(data);
        setLoading(false);
      });
  }, []);

  const filtered = useMemo(() => 
    activeCategory === "All" ? rawVideos : rawVideos.filter(v => v.category === activeCategory)
  , [rawVideos, activeCategory]);

  // 2. VIRTUALIZATION OBSERVER
  useEffect(() => {
    if (loading) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const id = entry.target.getAttribute("data-id");
        if (!id) return;
        
        if (entry.isIntersecting) {
          setVisibleIds(prev => new Set(prev).add(id));
        } else {
          setVisibleIds(prev => {
            const next = new Set(prev);
            next.delete(id);
            return next;
          });
        }
      });
    }, { 
      rootMargin: "200px 0px", // Pre-load 200px before they scroll into view
      threshold: 0.01 
    });

    // Timeout to ensure DOM is painted before observing
    const timer = setTimeout(() => {
      document.querySelectorAll(".gif-card").forEach(t => observer.observe(t));
    }, 100);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [filtered, loading]);

  if (loading) return (
    <div className="h-screen bg-black flex items-center justify-center">
      <Loader2 className="animate-spin text-white/10" size={30} />
    </div>
  );

  return (
    <main className="min-h-screen bg-[#020202] text-white selection:bg-white selection:text-black">
      
      {/* HUD */}
      <div className="pt-28 pb-6 sticky top-0 z-50 bg-[#020202]/90 backdrop-blur-md border-b border-white/5">
        <div className="flex flex-wrap justify-center gap-2 max-w-6xl mx-auto px-6">
          {["All", ...Array.from(new Set(rawVideos.map(v => v.category)))].map(cat => (
            <button 
              key={cat} 
              onClick={() => setActiveCategory(cat)} 
              className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] transition-all
                ${activeCategory === cat ? "bg-white text-black" : "text-white/20 hover:text-white"}`}
            >
              {cat}
            </button>
          ))}
          <button onClick={() => setRawVideos([...rawVideos].sort(() => Math.random() - 0.5))} className="ml-4 text-white/10 hover:text-white transition-colors">
            <Shuffle size={14} />
          </button>
        </div>
      </div>

      {/* GRID */}
      <div className="p-4 md:p-8 max-w-[1800px] mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filtered.map((v, i) => {
          const isVisible = visibleIds.has(v.id);
          return (
            <div 
              key={`${v.id}-${i}`} 
              data-id={v.id}
              onClick={() => setSelectedId(v.id)}
              className="gif-card relative aspect-[9/16] bg-zinc-950 rounded-2xl overflow-hidden border border-white/5 cursor-pointer group transition-all duration-500 hover:border-white/30 shadow-inner"
              style={{ transform: "translateZ(0)" }}
            >
              {/* Only the iframe is conditional, the div stays so the observer works */}
              {isVisible && (
                <iframe
                  src={`https://www.redgifs.com/ifr/${v.id}?controls=0&hd=0&autoplay=1&mute=1`}
                  className="w-full h-full pointer-events-none scale-[1.02] animate-in fade-in duration-1000"
                  frameBorder="0" scrolling="no" allow="autoplay"
                />
              )}
              
              {/* Fallback Loader / Skeleton */}
              {!isVisible && (
                <div className="absolute inset-0 flex items-center justify-center bg-[#050505]">
                  <div className="w-1.5 h-1.5 bg-white/5 rounded-full animate-ping" />
                </div>
              )}
              
              {/* Shield */}
              <div className="absolute inset-0 z-20" />
            </div>
          );
        })}
      </div>

      {/* MODAL */}
      {selectedId && (
        <div className="fixed inset-0 z-[300] bg-black overflow-y-scroll snap-y snap-mandatory scrollbar-hide">
          <button 
            onClick={() => setSelectedId(null)} 
            className="fixed top-8 right-8 z-[350] p-4 bg-white/5 hover:bg-white/10 rounded-full backdrop-blur-xl border border-white/10 text-white"
          >
            <X size={20} />
          </button>
          
          {filtered.map((v, i) => (
            <div 
              id={`reel-${v.id}`} 
              key={`modal-${v.id}`} 
              className="h-screen w-full flex items-center justify-center snap-start py-6"
            >
              <div className="h-full aspect-[9/16] bg-black rounded-[2rem] overflow-hidden border border-white/10 relative shadow-2xl">
                {(selectedId === v.id || Math.abs(filtered.findIndex(f => f.id === selectedId) - i) <= 1) && (
                  <iframe
                    src={`https://www.redgifs.com/ifr/${v.id}?controls=1&hd=1&autoplay=1`}
                    frameBorder="0" scrolling="no" allowFullScreen allow="autoplay"
                    className="w-full h-full"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}