"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX, Loader2, Headphones } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";
import { motion, AnimatePresence } from "framer-motion";

interface QuestionVoiceProps {
  question: string;
  options: Record<string, string>;
  autoPlay?: boolean;
}

export function QuestionVoice({ question, options, autoPlay = false }: QuestionVoiceProps) {
  const [loading, setLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const { user } = useAuthStore();
  const [audioInstance, setAudioInstance] = useState<HTMLAudioElement | null>(null);

  const cleanText = (html: string) => html.replace(/<[^>]+>/g, '');

  const generateAudio = async () => {
    if (user?.subscription_tier !== 'PAID') {
      toast.error("Premium Mode", { description: "Narration is a premium feature for focused study." });
      return;
    }

    setLoading(true);
    try {
      const optionsText = Object.entries(options)
        .map(([key, val]) => `Option ${key.toUpperCase()}: ${cleanText(val)}`)
        .join(". [pause] ");
      
      const textToSpeak = `Question: ${cleanText(question)}. [pause] ${optionsText}`;

      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text: textToSpeak,
          modelId: "eleven_flash_v2_5" // Strict requirement: low latency
        })
      });

      if (!res.ok) throw new Error("Narration failed");
      
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      setAudioUrl(url);
      
      const audio = new Audio(url);
      setAudioInstance(audio);
      audio.play();
      setIsPlaying(true);
      
      audio.onended = () => setIsPlaying(false);
    } catch (err) {
      toast.error("Invigilator voice unavailable");
    } finally {
      setLoading(false);
    }
  };

  const toggleAudio = () => {
    if (isPlaying && audioInstance) {
      audioInstance.pause();
      setIsPlaying(false);
    } else if (audioInstance) {
      audioInstance.play();
      setIsPlaying(true);
    } else {
      generateAudio();
    }
  };

  useEffect(() => {
    if (autoPlay && !audioUrl) {
      generateAudio();
    }
    return () => {
      if (audioInstance) {
        audioInstance.pause();
      }
    };
  }, [question]);

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleAudio}
        disabled={loading}
        className="h-9 px-3 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white border border-white/10 flex items-center gap-2"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : isPlaying ? (
          <VolumeX className="h-4 w-4 text-emerald-400" />
        ) : (
          <Headphones className="h-4 w-4" />
        )}
        <span className="text-xs font-medium">
          {loading ? "Mic Check..." : isPlaying ? "Stop Narration" : "Read Question"}
        </span>
      </Button>

      {isPlaying && (
        <div className="flex gap-1 h-3 items-end">
          {[1,2,3].map(i => (
            <motion.div
              key={i}
              animate={{ height: ["20%", "100%", "20%"] }}
              transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1 }}
              className="w-1 bg-emerald-500 rounded-full"
            />
          ))}
        </div>
      )}
    </div>
  );
}
