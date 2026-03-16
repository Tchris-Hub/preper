"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, Volume2, VolumeX, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface AudioPlayerProps {
  url: string;
  onFinished?: () => void;
  className?: string;
  autoPlay?: boolean;
}

export function PremiumAudioPlayer({ url, onFinished, className, autoPlay = false }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio(url);
    audioRef.current = audio;

    audio.addEventListener("loadedmetadata", () => setDuration(audio.duration));
    audio.addEventListener("timeupdate", () => setProgress((audio.currentTime / audio.duration) * 100));
    audio.addEventListener("ended", () => {
      setIsPlaying(false);
      if (onFinished) onFinished();
    });

    if (autoPlay) {
      audio.play().then(() => setIsPlaying(true)).catch(console.error);
    }

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, [url]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const restart = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = 0;
    audioRef.current.play();
    setIsPlaying(true);
  };

  return (
    <div className={cn("flex flex-col gap-3 p-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm shadow-xl w-full max-w-sm ml-auto", className)}>
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={togglePlay}
          className="h-12 w-12 rounded-full bg-indigo-500 hover:bg-indigo-600 text-white shrink-0 shadow-lg shadow-indigo-500/20"
        >
          {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-0.5" />}
        </Button>

        <div className="flex-1 flex flex-col gap-1">
          <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-neutral-500 font-bold mb-1">
            <span>Voice Coach</span>
            <span>{Math.floor(progress)}%</span>
          </div>
          
          {/* Animated Waveform */}
          <div className="h-8 flex items-end gap-[2px] overflow-hidden">
            {Array.from({ length: 30 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ height: "10%" }}
                animate={{ 
                  height: isPlaying ? [`${20 + Math.random() * 60}%`, `${10 + Math.random() * 40}%`, `${30 + Math.random() * 70}%`] : "10%" 
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 0.5 + Math.random() * 0.5,
                  ease: "easeInOut"
                }}
                className={cn(
                  "w-[3px] rounded-full",
                  progress > (i / 30) * 100 ? "bg-indigo-400" : "bg-white/10"
                )}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 mt-1 border-t border-white/5 pt-3">
        <div className="flex items-center gap-2">
           <Button variant="ghost" size="icon" onClick={() => setIsMuted(!isMuted)} className="h-8 w-8 text-neutral-400">
             {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
           </Button>
           <Button variant="ghost" size="icon" onClick={restart} className="h-8 w-8 text-neutral-400">
             <RotateCcw className="h-4 w-4" />
           </Button>
        </div>
        
        <span className="text-[10px] font-mono text-neutral-500">
          Ace Your Exams AI
        </span>
      </div>
    </div>
  );
}
