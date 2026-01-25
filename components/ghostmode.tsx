"use client";

import { useEffect, useState } from "react";

export default function GhostMode() {
  const [isGhost, setIsGhost] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Trigger on Enter key
      if (e.key === "Enter") {
        setIsGhost((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (!isGhost) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-[#0d1117] text-[#c9d1d9] font-mono p-12 overflow-auto select-none">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8 text-sm text-gray-500 border-b border-gray-800 pb-4">
          <span className="bg-gray-800 px-2 py-1 rounded text-gray-300">
            GET
          </span>
          <span>/v1/api/system-logs/archive_2026.json</span>
        </div>

        <div className="space-y-6">
          <section>
            <h1 className="text-xl font-bold text-blue-400 mb-2 underline">
              System Architecture Review
            </h1>
            <p className="text-sm leading-relaxed text-gray-400">
              The following data represents a snapshot of the distributed
              microservices cluster. Ensure all environment variables are
              decrypted before proceeding with the production build.
            </p>
          </section>

          <div className="bg-black/40 p-6 rounded-xl border border-gray-800 font-mono text-sm leading-relaxed shadow-inner">
            <div className="text-green-500">
              ✔ Success: Connection established to database cluster 'delta-9'
            </div>
            <div className="text-blue-400">
              ℹ Info: Indexing files in /usr/local/bin...
            </div>
            <div className="text-yellow-500/70">
              ⚠ Warning: Latency detected in Asia-Pacific region
            </div>
            <br />
            <div className="text-gray-500">
              {`{`}
              <div className="pl-4 italic">
                "status": "active",
                <br />
                "uptime": "14,209 seconds",
                <br />
                "load_balancer": "nginx/1.21.6",
                <br />
                "active_processes": [5502, 1209, 8821, 4402]
              </div>
              {`}`}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="h-32 bg-gray-900/50 rounded-lg border border-gray-800 flex items-center justify-center">
              <div className="text-[10px] text-gray-600 uppercase tracking-widest text-center">
                Memory Distribution
                <br />
                <span className="text-lg text-gray-400 font-bold">78.4%</span>
              </div>
            </div>
            <div className="h-32 bg-gray-900/50 rounded-lg border border-gray-800 flex items-center justify-center">
              <div className="text-[10px] text-gray-600 uppercase tracking-widest text-center">
                CPU Overhead
                <br />
                <span className="text-lg text-gray-400 font-bold">12.1%</span>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-12 text-[10px] text-gray-700 uppercase tracking-tighter">
          Internal Use Only — Confidential — (C) 2026 DevCorp Systems
        </p>
      </div>
    </div>
  );
}
