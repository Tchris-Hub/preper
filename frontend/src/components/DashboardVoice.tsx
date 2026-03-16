"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, Loader2, Sparkles, MessageSquare } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";

export function DashboardVoice() {
  const { user } = useAuthStore();
  const [briefing, setBriefing] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioInstance, setAudioInstance] = useState<HTMLAudioElement | null>(null);

  const fetchBriefing = async () => {
    if (loading || user?.subscription_tier !== 'PAID') return;
    
    setLoading(true);
    try {
      const res = await fetch("/api/briefing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: user?.first_name || user?.username,
          stats: {
            totalExams: 12, // Placeholder - should fetch real stats
            avgScore: 68,
            strongestSubject: "Physics"
          }
        })
      });

      const { briefing: text } = await res.json();
      setBriefing(text);

      const ttsRes = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text })
      });

      if (ttsRes.ok) {
        const blob = await ttsRes.blob();
        const url = window.URL.createObjectURL(blob);
        setAudioUrl(url);
        const audio = new Audio(url);
        setAudioInstance(audio);
        audio.play().then(() => setIsPlaying(true));
        audio.onended = () => setIsPlaying(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // We don't auto-fetch to save characters unless premium and first load
    if (user?.subscription_tier === 'PAID') {
       fetchBriefing();
    }
  }, []);

  if (user?.subscription_tier !== 'PAID') return null;

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-indigo-600/10 border border-indigo-500/20 rounded-2xl p-4 flex items-center justify-between gap-4 mb-6"
    >
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 rounded-full bg-indigo-500/20 flex items-center justify-center relative">
          {isPlaying && (
             <motion.div 
               animate={{ scale: [1, 1.5, 1] }} 
               transition={{ repeat: Infinity, duration: 2 }}
               className="absolute inset-0 bg-indigo-500/30 rounded-full" 
             />
          )}
          <Volume2 className={cn("h-5 w-5 text-indigo-400 relative z-10", isPlaying && "animate-pulse")} />
        </div>
        <div>
           <p className="text-sm font-medium text-white">
             {loading ? "Grace is preparing your briefing..." : isPlaying ? "Grace is speaking..." : "Personal Morning Briefing Ready"}
           </p>
           {briefing && (
             <p className="text-xs text-neutral-400 mt-0.5 line-clamp-1 italic">
               "{briefing}"
             </p>
           )}
        </div>
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          if (isPlaying) {
            audioInstance?.pause();
            setIsPlaying(false);
          } else if (audioUrl) {
            audioInstance?.play();
            setIsPlaying(true);
          } else {
            fetchBriefing();
          }
        }}
        disabled={loading}
        className="rounded-full bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : isPlaying ? "Mute" : "Replay"}
      </Button>
    </motion.div>
  );
}

// Utility for CN if needed
function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
