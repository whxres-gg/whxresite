"use client";

import { useState, useEffect } from "react";
import { Inter } from "next/font/google";
import { usePathname } from "next/navigation";
import { Analytics } from "@vercel/analytics/next";
import Navbar from "../components/navbar";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isGhostMode, setIsGhostMode] = useState(false);
  const pathname = usePathname();

  // Handle "Boss Key" toggle
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        setIsGhostMode((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <html lang="en" className="bg-black">
      <head>
        <title>
          {isGhostMode
            ? "System Documentation | Internal API"
            : "whxres • premium archive"}
        </title>
      </head>
      <body
        className={`${inter.className} antialiased bg-black text-white selection:bg-white selection:text-black overflow-x-hidden`}
      >
        {/* 1. GLOBAL NAVIGATION */}
        {!isGhostMode && <Navbar />}

        {/* 2. GHOST UI (Boss Key Overlay) */}
        {isGhostMode && (
          <div className="fixed inset-0 z-[9999] bg-[#0d1117] text-[#c9d1d9] font-mono p-6 md:p-12 overflow-auto select-none cursor-default animate-in fade-in duration-300">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-4 mb-10 text-[10px] text-gray-500 border-b border-gray-800/50 pb-6 uppercase tracking-widest">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/20" />
                </div>
                <span className="text-green-500 opacity-80">
                  ● secure_tunnel_active
                </span>
                <span className="hidden md:inline">session_id: 882-991-X</span>
                <span className="ml-auto opacity-50">
                  {new Date().toLocaleDateString()} //{" "}
                  {new Date().toLocaleTimeString()}
                </span>
              </div>

              <div className="space-y-10">
                <section>
                  <h1 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                    <span className="text-blue-500">#</span> Documentation / API
                    / Edge_Logs
                  </h1>
                  <p className="text-sm text-gray-500 max-w-2xl leading-relaxed">
                    Visualizing real-time telemetry from the distributed
                    edge-compute network. All high-bandwidth nodes are currently
                    reporting optimal latency (14ms). No anomalies detected in
                    the last 24-hour cycle.
                  </p>
                </section>

                {/* Fake Terminal */}
                <div className="bg-black/60 p-8 rounded-3xl border border-white/5 font-mono text-[12px] leading-loose shadow-2xl backdrop-blur-xl">
                  <div className="text-green-400/70 mb-2">
                    $ npm run sync:remote-archive
                  </div>
                  <div className="text-gray-500 italic mb-2">
                    › Initializing handshake with us-east-1...
                  </div>
                  <div className="text-blue-400">
                    ✔ Connection established via TLS 1.3
                  </div>
                  <div className="text-blue-400">
                    ✔ Metadata sync completed (4.2s)
                  </div>
                  <div className="text-white/80 mt-4 underline decoration-blue-500/50 underline-offset-4">
                    Recent Internal Pull Requests:
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2 opacity-60">
                    <div>feat: optimize-caching-layer</div>
                    <div className="text-right text-green-500">Merged</div>
                    <div>fix: cors-policy-v3</div>
                    <div className="text-right text-yellow-500">
                      Review Required
                    </div>
                  </div>
                </div>

                {/* Fake Graph */}
                <div className="h-24 w-full flex items-end gap-1 opacity-20 group">
                  {Array.from({ length: 40 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-white hover:bg-blue-500 transition-all duration-500"
                      style={{ height: `${Math.random() * 100}%` }}
                    />
                  ))}
                </div>

                <p className="pt-10 text-[9px] text-gray-700 uppercase tracking-[0.4em] text-center border-t border-white/5">
                  Encrypted Session. Tap{" "}
                  <span className="text-gray-400 px-1 border border-gray-800 rounded mx-1">
                    Enter
                  </span>{" "}
                  to return to terminal.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 3. ADAPTIVE SHORTCUT HINTS */}
        {!isGhostMode && (
          <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end gap-3 pointer-events-none">
            <div className="flex flex-col gap-2.5 p-4 rounded-[2rem] bg-zinc-900/40 border border-white/10 backdrop-blur-3xl shadow-2xl">
              <div className="flex items-center gap-3 px-1">
                <div className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
                </div>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/50">
                  <span className="text-white bg-white/10 px-1.5 py-1 rounded-lg border border-white/10 mr-2">
                    Enter
                  </span>
                  Ghost Mode
                </p>
              </div>

              {pathname === "/reels" && (
                <div className="pt-3 mt-1 border-t border-white/5 flex flex-col gap-3 animate-in slide-in-from-right-2">
                  <div className="flex items-center gap-3 px-1">
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/50">
                      <span className="text-white bg-white/10 px-1.5 py-1 rounded-lg border border-white/10">
                        ↑
                      </span>
                      <span className="text-white bg-white/10 px-1.5 py-1 rounded-lg border border-white/10 mx-1">
                        ↓
                      </span>
                      Next Video
                    </p>
                  </div>
                  <div className="flex items-center gap-3 px-1">
                    <div className="h-1.5 w-1.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/50">
                      <span className="text-white bg-white/10 px-2 py-1 rounded-lg border border-white/10 mr-2 uppercase">
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

        {/* 4. CONTENT */}
        <main className={isGhostMode ? "hidden" : "block"}>{children}</main>

        {/* 5. VERCEL ANALYTICS */}
        <Analytics />
      </body>
    </html>
  );
}
