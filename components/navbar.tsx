"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Home, Film, Trophy, Zap } from "lucide-react"; // Added Zap

export default function Navbar() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const touchStart = useRef<number | null>(null);

  // Added /tools to the scaled-down pages list
  const isReelsOrFame = pathname === "/reels" || pathname === "/fame" || pathname === "/tools";

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStart.current = e.touches[0].clientY;
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (touchStart.current === null) return;
      const touchEnd = e.touches[0].clientY;
      const distance = touchStart.current - touchEnd;
      if (distance > 40) setIsVisible(false);
      if (distance < -40) setIsVisible(true);
    };

    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchmove", handleTouchMove);
    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  const activeStyles =
    "bg-white/20 border-white/40 text-white font-black shadow-[inset_0_0_12px_rgba(255,255,255,0.1)]";
  const inactiveStyles =
    "text-white/40 border-transparent hover:text-white/80 hover:bg-white/5";

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[100] flex justify-center pointer-events-none"
      onMouseEnter={() => setIsVisible(true)}
    >
      <nav
        className={`
          mt-6 transition-all duration-500 ease-[cubic-bezier(0.2,1,0.2,1)]
          ${isVisible ? "translate-y-0 opacity-100" : "-translate-y-24 opacity-0"}
          ${isReelsOrFame ? "scale-90" : "scale-100"}
          pointer-events-auto
        `}
      >
        <div
          className="flex items-center gap-1.5 p-1.5 rounded-full bg-black/20 border border-white/10 backdrop-blur-2xl"
          style={{ transform: "translateZ(0)" }}
        >
          {/* Home Link */}
          <Link
            href="/"
            className={`flex items-center gap-2 px-5 py-2 rounded-full text-[10px] uppercase tracking-[0.25em] border transition-all duration-300 ${
              pathname === "/" ? activeStyles : inactiveStyles
            }`}
          >
            <Home size={13} className={pathname === "/" ? "opacity-100" : "opacity-40"} />
            <span>Home</span>
          </Link>

          {/* Reels Link */}
          <Link
            href="/reels"
            className={`flex items-center gap-2 px-5 py-2 rounded-full text-[10px] uppercase tracking-[0.25em] border transition-all duration-300 ${
              pathname === "/reels" ? activeStyles : inactiveStyles
            }`}
          >
            <Film size={13} className={pathname === "/reels" ? "opacity-100" : "opacity-40"} />
            <span>Reels</span>
          </Link>

          {/* Fame Link */}
          <Link
            href="/fame"
            className={`flex items-center gap-2 px-5 py-2 rounded-full text-[10px] uppercase tracking-[0.25em] border transition-all duration-300 ${
              pathname === "/fame" ? activeStyles : inactiveStyles
            }`}
          >
            <Trophy size={13} className={pathname === "/fame" ? "opacity-100" : "opacity-40"} />
            <span>Fame</span>
          </Link>

          {/* Tools Link (New) */}
          <Link
            href="/tools"
            className={`flex items-center gap-2 px-5 py-2 rounded-full text-[10px] uppercase tracking-[0.25em] border transition-all duration-300 ${
              pathname === "/tools" ? activeStyles : inactiveStyles
            }`}
          >
            <Zap size={13} className={pathname === "/tools" ? "opacity-100" : "opacity-40"} />
            <span>Tools</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}