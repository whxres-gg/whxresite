"use client";

import { useState, useEffect } from "react";
import { Inter } from "next/font/google";
import { usePathname } from "next/navigation";
import Navbar from "../components/navbar"; // Ensure this path is correct
import "./globals.css";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isGhostMode, setIsGhostMode] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle Ghost Mode on Enter
      if (e.key === "Enter") setIsGhostMode((prev) => !prev);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <html lang="en">
      <head>
        <title>
          {isGhostMode ? "System Documentation | Archive" : "whxres"}
        </title>
      </head>
      <body className={`${inter.className} antialiased bg-black text-white`}>
        {/* GLOBAL NAVIGATION */}
        {/* We hide the navbar if Ghost Mode is active for total immersion */}
        {!isGhostMode && <Navbar />}

        {/* THE GHOST UI (Boss Key Overlay) */}
        {isGhostMode && (
          <div className="fixed inset-0 z-[9999] bg-[#0d1117] text-[#c9d1d9] font-mono p-10 overflow-auto select-none cursor-default">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-8 text-xs text-gray-500 border-b border-gray-800 pb-4">
                <span className="bg-green-500/10 text-green-500 px-2 py-0.5 rounded border border-green-500/20 font-bold">
                  STABLE
                </span>
                <span>docs / api / internal-v4-logs.json</span>
                <span className="ml-auto opacity-50">
                  Last Sync: {new Date().toLocaleDateString()}
                </span>
              </div>

              <div className="space-y-8">
                <section>
                  <h1 className="text-2xl font-bold text-white mb-2">
                    Cloud Infrastructure Overview
                  </h1>
                  <p className="text-sm text-gray-400 max-w-2xl leading-relaxed">
                    Visualizing real-time telemetry from the distributed
                    edge-compute network. All nodes are currently reporting
                    optimal latency. Terminal Session Active.
                  </p>
                </section>

                <div className="bg-black/40 p-6 rounded-2xl border border-white/5 font-mono text-[13px] leading-relaxed shadow-2xl backdrop-blur-sm">
                  <div className="flex gap-1.5 mb-4">
                    <div className="w-3 h-3 rounded-full bg-red-500/20" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                    <div className="w-3 h-3 rounded-full bg-green-500/20" />
                  </div>
                  <div className="text-green-400/80">
                    $ npm run deploy:production
                  </div>
                  <div className="text-gray-500 italic mt-1">
                    › Optimized build in progress...
                  </div>
                  <div className="text-blue-400 mt-2">
                    ✔ 142 modules transformed.
                  </div>
                  <div className="text-blue-400 font-bold">
                    ✔ Webpack compiled successfully.
                  </div>
                </div>

                <p className="pt-10 text-[10px] text-gray-600 uppercase tracking-widest text-center border-t border-white/5">
                  Press Enter to re-authenticate and exit secure session.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ADAPTIVE GLOBAL SHORTCUT GUIDE */}
        {!isGhostMode && (
          <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end gap-2 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col gap-2 p-3 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl shadow-2xl">
              {/* Ghost Mode Hint (Always Shown) */}
              <div className="flex items-center gap-3 px-1">
                <div className="relative flex h-2 w-2">
                  <span className="animate-ping absolute h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-white/70">
                  <span className="text-white bg-white/10 px-1.5 py-0.5 rounded border border-white/20 mr-2">
                    Enter
                  </span>
                  Ghost Mode
                </p>
              </div>

              {/* Reels-Only Shortcuts */}
              {pathname === "/reels" && (
                <div className="pt-2 mt-1 border-t border-white/5 flex flex-col gap-2">
                  <div className="flex items-center gap-2 px-1">
                    <div className="h-2 w-2 rounded-full bg-blue-500" />
                    <p className="text-[10px] font-bold uppercase tracking-wider text-white/70">
                      <span className="text-white bg-white/10 px-1 py-0.5 rounded border border-white/20">
                        ↑
                      </span>
                      <span className="text-white bg-white/10 px-1 py-0.5 rounded border border-white/20 mr-2">
                        ↓
                      </span>
                      Scroll
                    </p>
                  </div>
                  <div className="flex items-center gap-2 px-1">
                    <div className="h-2 w-2 rounded-full bg-purple-500" />
                    <p className="text-[10px] font-bold uppercase tracking-wider text-white/70">
                      <span className="text-white bg-white/10 px-1.5 py-0.5 rounded border border-white/20 mr-2">
                        Space
                      </span>
                      Pause
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {children}
      </body>
    </html>
  );
}
