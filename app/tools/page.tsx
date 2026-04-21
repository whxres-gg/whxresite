"use client";

import { useState, useRef, useEffect } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import { 
  Loader2, 
  Download, 
  Upload, 
  ShieldAlert, 
  Zap, 
  Square
} from "lucide-react";

type TargetSize = 8 | 10 | 25 | 50;

export default function DiscordCompressor() {
  const [loaded, setLoaded] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [target, setTarget] = useState<TargetSize | null>(null);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isMultithreaded, setIsMultithreaded] = useState(false);

  const ffmpegRef = useRef<FFmpeg | null>(null);

  const loadFFmpeg = async () => {
    try {
      const ffmpeg = new FFmpeg();
      ffmpegRef.current = ffmpeg;

      // Check for SharedArrayBuffer support (requires HTTPS/Localhost)
      const supportsMT = typeof SharedArrayBuffer !== 'undefined';
      setIsMultithreaded(supportsMT);

      const coreVersion = supportsMT ? "core-mt" : "core";
      const baseURL = `https://unpkg.com/@ffmpeg/${coreVersion}@0.12.6/dist/umd`;
      
      ffmpeg.on("progress", ({ progress }) => setProgress(Math.round(progress * 100)));

      const config: any = {
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
      };

      if (supportsMT) {
        config.workerURL = await toBlobURL(`${baseURL}/ffmpeg-core.worker.js`, "text/javascript");
      }

      await ffmpeg.load(config);
      setLoaded(true);
    } catch (err) {
      console.error("FFmpeg Load Error:", err);
      setError("Engine failed to ignite. Try using localhost:3000.");
    }
  };

  useEffect(() => { loadFFmpeg(); }, []);

  const handleStop = async () => {
    if (ffmpegRef.current) {
      ffmpegRef.current.terminate();
      setProcessing(false);
      setProgress(0);
      setLoaded(false);
      await loadFFmpeg(); 
    }
  };

  const handleCompress = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const ffmpeg = ffmpegRef.current;
    
    if (!file || !loaded || !ffmpeg || !target) return;

    // Safety Gate: Don't "compress" if it's already smaller
    const fileSizeInMB = file.size / (1024 * 1024);
    if (fileSizeInMB <= target) {
      setError(`File is already ${fileSizeInMB.toFixed(1)}MB (smaller than target).`);
      return;
    }

    setError(null);
    setProcessing(true);
    setProgress(0);

    const inputName = "input.mp4";
    const outputName = "output.mp4";

    try {
      await ffmpeg.writeFile(inputName, await fetchFile(file));

      // 1. PROBE DURATION
      let duration = 0;
      const logHandler = ({ message }: { message: string }) => {
        const durationMatch = message.match(/Duration: (\d+):(\d+):(\d+.\d+)/);
        if (durationMatch) {
          const h = parseFloat(durationMatch[1]);
          const m = parseFloat(durationMatch[2]);
          const s = parseFloat(durationMatch[3]);
          duration = h * 3600 + m * 60 + s;
        }
      };
      
      ffmpeg.on("log", logHandler);
      await ffmpeg.exec(["-i", inputName, "-f", "null", "-"]);
      ffmpeg.off("log", logHandler); // Clean up log listener

      // 2. CALCULATE BITRATE
      const finalDuration = duration > 0 ? duration : 60;
      // Formula: (TargetMB * 8192 bits) / seconds = kbps
      // Subtracting 128 for audio room
      const videoBitrate = Math.floor((target * 8192) / finalDuration) - 128;
      const safeBitrate = Math.max(videoBitrate, 100);

      const command = [
        "-i", inputName,
        "-vf", "scale=-2:720", 
        "-vcodec", "libx264",
        "-b:v", `${safeBitrate}k`, 
        "-maxrate", `${target}M`,
        "-bufsize", `${target * 2}M`,
        "-preset", "superfast", 
        "-acodec", "aac",
        "-b:a", "128k",
        outputName
      ];

      if (isMultithreaded) {
        command.splice(12, 0, "-threads", "0");
      }

      await ffmpeg.exec(command);

      const data = await ffmpeg.readFile(outputName);
      const url = URL.createObjectURL(new Blob([(data as any).buffer], { type: "video/mp4" }));
      setOutputUrl(url);
    } catch (err) {
      setError("Crunching interrupted or failed.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans p-6 flex flex-col items-center justify-center">
      <div className="w-full max-w-xl bg-zinc-900/50 border border-white/10 rounded-[3rem] p-10 backdrop-blur-xl shadow-2xl">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="p-4 rounded-full bg-indigo-500/10 text-indigo-500 mb-4 ring-1 ring-indigo-500/20">
            <Zap size={32} fill="currentColor" />
          </div>
          <h1 className="text-3xl font-black italic tracking-tighter uppercase leading-none">Discord Squish</h1>
          <p className="text-white/40 text-[10px] mt-3 uppercase tracking-widest font-bold">
            {loaded 
              ? `${isMultithreaded ? 'High Speed (Multi-threaded)' : 'Standard (Single-core)'}` 
              : "Calibrating WASM engine..."}
          </p>
        </div>

        {/* PRESET SELECTOR */}
        <div className="mb-8">
          <label className="text-[10px] font-black uppercase text-white/20 tracking-widest mb-3 block text-center">Step 1: Select Target Size</label>
          <div className="flex gap-2 bg-black/50 p-1.5 rounded-2xl border border-white/5">
            {[8, 10, 25, 50].map((size) => (
              <button
                key={size}
                disabled={processing}
                onClick={() => { setTarget(size as TargetSize); setOutputUrl(null); setError(null); }}
                className={`flex-1 py-3 rounded-xl text-[10px] font-black transition-all duration-300 ${target === size ? "bg-white text-black shadow-lg scale-[1.02]" : "text-white/20 hover:text-white"}`}
              >
                {size}MB
              </button>
            ))}
          </div>
        </div>

        {/* UPLOAD ZONE */}
        {!processing && !outputUrl && (
          <div className={!target ? "opacity-20 pointer-events-none scale-95" : "animate-in fade-in slide-in-from-bottom-4 duration-500"}>
            <label className="group relative flex flex-col items-center justify-center w-full aspect-video border-2 border-dashed border-white/10 rounded-[2rem] transition-all cursor-pointer hover:border-indigo-500/50 hover:bg-indigo-500/5">
              <Upload className="text-white/20 group-hover:text-indigo-500 transition-colors mb-4" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Select Video (Max 500MB)</span>
              <input type="file" accept="video/*" className="hidden" onChange={handleCompress} />
            </label>
          </div>
        )}

        {/* PROGRESS + STOP */}
        {processing && (
          <div className="w-full aspect-video flex flex-col items-center justify-center border border-white/5 rounded-[2rem] bg-black/20 backdrop-blur-sm">
            <Loader2 className="animate-spin text-indigo-500 mb-6" size={40} />
            <div className="w-48 h-1.5 bg-white/5 rounded-full overflow-hidden mb-8">
              <div className="h-full bg-indigo-500 transition-all duration-300 shadow-[0_0_15px_rgba(99,102,241,0.5)]" style={{ width: `${progress}%` }} />
            </div>
            
            <button 
              onClick={handleStop}
              className="flex items-center gap-2 px-8 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-full text-[10px] font-black uppercase tracking-widest transition-all active:scale-95"
            >
              <Square size={12} fill="currentColor" /> Stop Encoding
            </button>
            
            <span className="text-[10px] font-black mt-4 text-white/20 tracking-[0.2em]">{progress}% CRUNCHING</span>
          </div>
        )}

        {/* RESULT */}
        {outputUrl && !processing && (
          <div className="flex flex-col items-center animate-in zoom-in duration-500 w-full">
            <div className="w-full aspect-video rounded-[2rem] overflow-hidden border border-white/10 mb-8 bg-black shadow-2xl shadow-indigo-500/5">
              <video src={outputUrl} controls className="w-full h-full object-contain" />
            </div>
            <div className="flex gap-3 w-full">
              <a href={outputUrl} download={`compressed_${target}mb.mp4`} className="flex-1 flex items-center justify-center gap-2 py-5 bg-indigo-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-400 transition-all active:scale-95 shadow-lg shadow-indigo-500/20">
                <Download size={16} /> Download
              </a>
              <button onClick={() => { setOutputUrl(null); setTarget(null); }} className="px-8 py-5 border border-white/10 rounded-2xl text-[10px] font-bold uppercase text-white/40 hover:text-white transition-all">
                Reset
              </button>
            </div>
          </div>
        )}

        {/* ERROR MESSAGE */}
        {error && (
          <div className="mt-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-500 animate-in slide-in-from-top-2">
            <ShieldAlert size={18} />
            <p className="text-[10px] font-bold uppercase">{error}</p>
          </div>
        )}
      </div>
      
      <div className="mt-8 flex flex-col items-center gap-2">
        <p className="text-[9px] text-white/10 uppercase tracking-[0.5em] font-bold text-center leading-relaxed">
          Privacy: No cloud processing. Runs in your browser.
        </p>
        {!loaded && <p className="text-[8px] text-indigo-500/40 uppercase font-black animate-pulse">Downloading engine core...</p>}
      </div>
    </div>
  );
}