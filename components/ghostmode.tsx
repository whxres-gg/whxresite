"use client";

import { useEffect } from "react";
import { Lock, Ghost } from "lucide-react";

export default function GhostMode() {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Trigger on Enter OR specifically the Left Shift key
      // e.code is more reliable for specific side-keys than e.key
      if (e.key === "Enter" || e.code === "ShiftLeft") {
        window.location.href = "https://www.indeed.com/jobs?q=software+engineer&l=Remote&vjk=403c945b0845a7b8";
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      {/* 1. SIDE VERTICAL TAB (Middle Right) */}
      <div 
        className="fixed right-0 top-1/2 -translate-y-1/2 z-[9998] flex items-center pointer-events-auto group"
        title="System Integrity Status: SECURE"
      >
        <div className="w-1 h-16 bg-white/5 rounded-l-full backdrop-blur-sm border border-r-0 border-white/10 transition-all duration-500 group-hover:w-8 group-hover:bg-white/10 group-hover:border-white/20 flex flex-col items-center justify-center gap-2 overflow-hidden">
          <Lock size={12} className="text-white/10 group-hover:text-green-500/80 transition-colors duration-500 delay-100" />
          
          <span className="absolute rotate-90 text-[7px] font-black uppercase tracking-[0.4em] text-white/0 group-hover:text-white/40 transition-colors duration-700 whitespace-nowrap origin-center translate-x-6 group-hover:translate-x-0">
            SYSTEM LOGS
          </span>
        </div>
      </div>

      {/* 2. SUBTLE KEY HINT (Bottom Right) */}
      <div className="fixed bottom-4 right-4 z-[9998] pointer-events-auto group">
        <div className="flex items-center gap-3 px-3 py-2 rounded-full bg-white/[0.02] border border-white/0 hover:border-white/10 hover:bg-white/5 backdrop-blur-md transition-all duration-500">
          {/* Subtle Ghost Icon */}
          <Ghost size={12} className="text-white/10 group-hover:text-white/40 transition-colors" />
          
          {/* Hidden text revealed on hover */}
          <div className="max-w-0 overflow-hidden group-hover:max-w-[200px] transition-all duration-500 ease-in-out">
            <p className="text-[8px] font-bold uppercase tracking-widest text-white/30 whitespace-nowrap pr-2">
              Ghost: <span className="text-white/60">L-Shift</span> or <span className="text-white/60">Enter</span>
            </p>
          </div>
        </div>
      </div>

      {/* 3. HIDDEN STRUCTURE FOR ACCESSIBILITY (SEO COVER) */}
      <div className="sr-only">
        <h1>Senior Software Engineer - Distributed Systems</h1>
        <p>Success: Connection established to database cluster &apos;delta-9&apos;</p>
        <pre>
          {`{
            "status": "active",
            "node": "us-east-1",
            "uptime": "14,209_seconds",
            "security": "WAF_ENABLED"
          }`}
        </pre>
      </div>
    </>
  );
}