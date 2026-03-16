"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2, Lock, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { PremiumAudioPlayer } from "./PremiumAudioPlayer";
import { motion, AnimatePresence } from "framer-motion";
import { useNotebookStore } from "@/store/useNotebookStore";
import { Bookmark, CheckCircle } from "lucide-react";

interface ExplanationVoiceProps {
  question: any; // The full question object
}

export function ExplanationVoice({ question }: ExplanationVoiceProps) {
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [generatedText, setGeneratedText] = useState<string | null>(null);
  const [language, setLanguage] = useState("English");
  const [isSaved, setIsSaved] = useState(false);
  const { user } = useAuthStore();
  const router = useRouter();
  const addNote = useNotebookStore((state) => state.addNote);

  const saveToNotebook = () => {
    if (!generatedText) return;
    addNote({
      title: `Explanation: ${question.subject || 'General'}`,
      content: generatedText,
      subject: question.subject,
      type: 'explanation'
    });
    setIsSaved(true);
    toast.success("Saved to your Personal Notebook!");
  };

  const handleAction = async () => {
    if (user?.subscription_tier !== 'PAID') {
      toast.error("Premium Feature", {
        description: "Upgrade to Premium to hear your personal tutor explain this!"
      });
      router.push('/subscription');
      return;
    }

    if (audioUrl) {
       setAudioUrl(null); // Clear previous if they changed language
       setGeneratedText(null);
    }

    setLoading(true);
    try {
      // 1. Generate Explanation via Gemini
      const explainRes = await fetch('/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: question.question,
          options: question.option,
          correctAnswer: question.answer,
          subject: question.subject,
          language: language
        })
      });

      const { explanation, error: explainError } = await explainRes.json();
      if (explainError) throw new Error(explainError);
      
      setGeneratedText(explanation);

      // 2. Convert to Audio via ElevenLabs proxy
      const ttsRes = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: explanation })
      });

      if (!ttsRes.ok) throw new Error("Voice generation failed");
      
      const blob = await ttsRes.blob();
      const url = window.URL.createObjectURL(blob);
      setAudioUrl(url);
      
      toast.success("Tutor is ready!");
    } catch (err: any) {
      console.error(err);
      toast.error("Vocal coach unavailable", { description: "Please check your connection and try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {!audioUrl && (
        <div className="flex flex-wrap gap-2 mb-2">
           {["English", "Pidgin", "Yoruba", "Igbo", "Hausa"].map(lang => (
             <button
               key={lang}
               onClick={() => setLanguage(lang)}
               className={`text-[10px] font-bold px-3 py-1 rounded-full border transition-all ${
                 language === lang 
                  ? "bg-indigo-500 border-indigo-500 text-white" 
                  : "bg-white/5 border-white/10 text-neutral-400 hover:border-white/20"
               }`}
             >
               {lang}
             </button>
           ))}
        </div>
      )}

      {!audioUrl && (
        <Button 
          variant="outline" 
          size="lg" 
          onClick={handleAction} 
          disabled={loading}
          className="w-full relative overflow-hidden group bg-emerald-500/5 hover:bg-emerald-500/10 border-emerald-500/20 text-emerald-400 h-14 rounded-2xl transition-all"
        >
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-3"
              >
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="font-bold tracking-tight">Thinking like a tutor...</span>
              </motion.div>
            ) : (
              <motion.div 
                key="default"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-3"
              >
                {user?.subscription_tier === 'PAID' ? (
                   <>
                     <Sparkles className="h-5 w-5 animate-pulse" />
                     <span className="font-bold tracking-tight">Listen to AI Tutor Explanation</span>
                   </>
                ) : (
                  <>
                    <Lock className="h-5 w-5" />
                    <span className="font-bold tracking-tight">Unlock Voice Explanation</span>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Subtle shine effect */}
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]" />
        </Button>
      )}

      {generatedText && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/20 rounded-2xl p-6 border border-white/5 relative"
        >
          <div className="flex gap-4">
             <div className="h-10 w-10 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0">
                <MessageCircle className="h-5 w-5 text-indigo-400" />
             </div>
             <div className="space-y-4 flex-1">
                <p className="text-neutral-300 leading-relaxed italic">
                  "{generatedText.replace(/\[.*?\]/g, '')}"
                </p>
                {audioUrl && (
                   <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <PremiumAudioPlayer url={audioUrl} autoPlay />
                      </div>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={saveToNotebook} 
                        className={isSaved ? "text-emerald-400" : "text-neutral-500 hover:text-indigo-400"}
                      >
                        {isSaved ? <CheckCircle className="h-5 w-5" /> : <Bookmark className="h-5 w-5" />}
                      </Button>
                   </div>
                 )}
             </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
