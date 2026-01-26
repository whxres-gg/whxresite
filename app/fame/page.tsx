"use client";

import { useState } from "react";
import { ChevronLeft, X, Trophy, Star, Heart, Flame, Zap } from "lucide-react";
import Link from "next/link";

// --- CONFIGURATION: 4 Categories Now ---
const CATEGORIES = [
  {
    id: "asian",
    name: "Asian",
    handle: "@AluerierFlare",
    image: "/asia.jpeg",
    icon: Star,
  },
  {
    id: "slut",
    name: "Slut",
    handle: "@AellaGirl",
    image: "/girl.jpeg",
    icon: Flame,
  },
  {
    id: "trans",
    name: "Trans",
    handle: "@Taftaj",
    image: "/trans.jpeg",
    icon: Zap,
  },
  {
    id: "hentai",
    name: "Hentai",
    handle: "Would you breed her?",
    image: "/hentai.jpeg",
    icon: Heart,
  },
];

export default function FamePage() {
  const [selectedImg, setSelectedImg] = useState<string | null>(null);

  return (
    <main className="h-dvh bg-black text-white flex flex-col overflow-hidden font-sans select-none relative">
      {/* 1. TOP HEADER */}
      <header className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between z-50">
        <Link
          href="/reels"
          className="opacity-40 hover:opacity-100 transition-opacity"
        >
          <ChevronLeft size={24} />
        </Link>
        <div className="w-10" />
      </header>

      {/* 2. MAIN GRID (4 Columns) */}
      <div className="flex-1 flex flex-col md:flex-row w-full h-full">
        {CATEGORIES.map((cat) => (
          <div
            key={cat.id}
            onClick={() => setSelectedImg(cat.image)}
            className="relative flex-1 group cursor-zoom-in overflow-hidden border-b md:border-b-0 md:border-r border-white/5 bg-zinc-950"
          >
            {/* Image Source */}
            <img
              src={cat.image}
              alt={cat.name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />

            {/* Gradient to make the bottom pill readable */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* BOTTOM GLASS PILL */}
            <div className="absolute bottom-8 left-0 right-0 flex justify-center translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
              <div className="flex items-center gap-3 px-4 py-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-md shadow-2xl">
                <cat.icon size={12} className="text-white/70" />
                <span className="text-[10px] font-black uppercase tracking-wider text-white">
                  {cat.name} <span className="mx-1 text-white/20">|</span>{" "}
                  {cat.handle}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 3. CENTER BOTTOM "HIGHEST VOTED" PILL */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[60] pointer-events-none">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/5 bg-zinc-900/40 backdrop-blur-sm">
          <Trophy size={10} className="text-yellow-500/60" />
          <span className="text-[8px] font-bold uppercase tracking-[0.3em] text-white/30">
            Our highest voted posts
          </span>
        </div>
      </div>

      {/* 4. LIGHTBOX POPUP */}
      {selectedImg && (
        <div
          className="fixed inset-0 z-[100] bg-black/98 backdrop-blur-xl flex items-center justify-center p-4"
          onClick={() => setSelectedImg(null)}
        >
          <button className="absolute top-8 right-8 text-white/20 hover:text-white transition-colors">
            <X size={32} />
          </button>
          <img
            src={selectedImg}
            className="max-w-full max-h-full object-contain rounded-sm shadow-2xl animate-in zoom-in-95 duration-200"
            alt="Full view"
          />
        </div>
      )}

      {/* Global CRT Overlay */}
      <div className="absolute inset-0 z-40 pointer-events-none opacity-[0.02] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </main>
  );
}
