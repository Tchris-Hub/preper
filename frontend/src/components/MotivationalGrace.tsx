"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Volume2 } from "lucide-react";

const TIPS = [
  "Take a deep breath. You're doing much better than you think.",
  "Remember: one question at a time. Don't rush yourself.",
  "Chiamaka, you've stayed focused for 30 minutes. That's a huge win!",
  "Nigeria's future is bright because you are studying right now.",
  "If it gets too tough, remember why you started. You've got this.",
];

export function MotivationalGrace() {
  const [show, setShow] = useState(false);
  const [tip, setTip] = useState("");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const triggerTip = async () => {
    const randomTip = TIPS[Math.floor(Math.random() * TIPS.length)];
    setTip(randomTip);
    setShow(true);

    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: randomTip })
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        setAudioUrl(url);
        new Audio(url).play();
      }
    } catch (e) { console.error(e); }

    // Auto-hide after 10s
    setTimeout(() => setShow(false), 10000);
  };

  useEffect(() => {
    // Spontaneously trigger every 15-20 mins (simulated here with a 5% chance on load)
    if (Math.random() < 0.05) {
       triggerTip();
    }
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 100, opacity: 0 }}
          className="fixed top-20 right-4 md:top-24 md:right-8 z-[60] flex items-center gap-4 bg-indigo-600 p-1 pr-4 rounded-full shadow-2xl border border-white/20 max-w-[calc(100vw-2rem)] md:max-w-md"
        >
          <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-white/20 bg-indigo-500">
             <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Grace" alt="Grace" />
          </div>
          <div className="max-w-[200px]">
             <p className="text-[11px] text-white font-bold leading-tight line-clamp-2 italic">
               "{tip}"
             </p>
          </div>
          <button onClick={() => setShow(false)} className="text-white/50 hover:text-white">
             <X className="h-3 w-3" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
