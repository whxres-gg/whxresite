"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { 
  Church,      /* Sanctum */
  Ghost,       /* Visions */
  Moon,        /* Relics */
  Crown        /* Dynasty */
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const touchStart = useRef<number | null>(null);

  // Updated logic to exclude /tools
  const isReelsOrFame = 
    pathname === "/reels" || 
    pathname === "/curated" || 
    pathname === "/fame";

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
    "bg-white/10 border-white/40 text-white shadow-[0_0_20px_rgba(255,255,255,0.1),inset_0_0_12px_rgba(255,255,255,0.05)] blur-[0.3px]";
  const inactiveStyles =
    "text-white/20 border-transparent hover:text-white/60 hover:bg-white/5 hover:border-white/10";

  // Cleaned up nav items
  const navItems = [
    { href: "/", label: "Home", icon: Church },
    { href: "/reels", label: "Reels", icon: Ghost },
    { href: "/curated", label: "Playlist", icon: Moon },
    { href: "/fame", label: "Fame", icon: Crown },
  ];

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[100] flex justify-center pointer-events-none"
      onMouseEnter={() => setIsVisible(true)}
    >
      <nav
        className={`
          mt-8 transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]
          ${isVisible ? "translate-y-0 opacity-100" : "-translate-y-24 opacity-0"}
          ${isReelsOrFame ? "scale-90" : "scale-100"}
          pointer-events-auto
        `}
      >
        <div
          className="flex items-center gap-1 p-1.5 rounded-full bg-black/40 border border-white/5 backdrop-blur-3xl shadow-2xl"
          style={{ transform: "translateZ(0)" }}
        >
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center gap-2.5 px-6 py-2.5 rounded-full 
                  text-[9px] uppercase tracking-[0.3em] font-light
                  border transition-all duration-500 group
                  ${isActive ? activeStyles : inactiveStyles}
                `}
              >
                <Icon 
                  size={14} 
                  strokeWidth={isActive ? 1.5 : 1}
                  className={`
                    transition-all duration-500 
                    ${isActive ? "opacity-100 scale-110 drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]" : "opacity-30 group-hover:opacity-100"}
                  `} 
                />
                <span className={isActive ? "opacity-100" : "opacity-80 group-hover:opacity-100"}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}