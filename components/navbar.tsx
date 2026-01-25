"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const isReels = pathname === "/reels";

  const activeStyles = "bg-white/20 text-white font-bold";
  const inactiveStyles = "text-white/50 hover:text-white font-medium";

  return (
    /* We remove the height from the trigger zone and use a top-offset instead
       to prevent the 'invisible box' line artifact. */
    <div className="fixed top-0 left-0 right-0 z-[100] group h-16 pointer-events-auto">
      <nav
        className={`flex justify-center w-full pt-6 transition-transform duration-700 will-change-transform
          ${isReels ? "-translate-y-[110%] group-hover:translate-y-0" : "translate-y-0"}
        `}
        style={{
          transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
          transformStyle: "preserve-3d", // Forces high-quality rendering
          backfaceVisibility: "hidden", // Prevents flickering
        }}
      >
        <div className="flex gap-1 p-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-xl pointer-events-auto shadow-none">
          <Link
            href="/"
            className={`px-6 py-2 rounded-full text-sm transition-all duration-300 ${
              pathname === "/" ? activeStyles : inactiveStyles
            }`}
          >
            Home
          </Link>
          <Link
            href="/reels"
            className={`px-6 py-2 rounded-full text-sm transition-all duration-300 ${
              pathname === "/reels" ? activeStyles : inactiveStyles
            }`}
          >
            Reels
          </Link>
        </div>
      </nav>
    </div>
  );
}
