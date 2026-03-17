"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Headphones, Play, Sparkles, Calendar, 
  Volume2, Loader2, Wand2, History,
  CheckCircle2, Clock, Trash2, Mic2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PremiumAudioPlayer } from "@/components/PremiumAudioPlayer";
import { toast } from "sonner";
import { format } from "date-fns";

interface Recap {
  id: string;
  title: string;
  summary: string;
  audio_url: string;
  created_at: string;
}

export default function RecapsPage() {
  const [recaps, setRecaps] = useState<Recap[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [playingId, setPlayingId] = useState<string | null>(null);

  const fetchRecaps = async () => {
    try {
      const res = await fetch("/api/ai/recaps");
      const data = await res.json();
      if (res.ok) {
        setRecaps(data);
      }
    } catch (err) {
      toast.error("Failed to load your audio library");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecaps();
  }, []);

  const generateRecap = async () => {
    setGenerating(true);
    try {
      const res = await fetch("/api/ai/recaps", {
        method: "POST"
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Generation failed.");
        return;
      }

      setRecaps([data, ...recaps]);
      toast.success("Grace has recorded a new briefing for you!");
    } catch (err) {
      toast.error("Network error during recording.");
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <Loader2 className="h-10 w-10 text-indigo-500 animate-spin" />
        <p className="text-neutral-400">Opening your audio vault...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20">
      {/* Header & Primary CTA */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tight text-white flex items-center gap-4">
             <Headphones className="h-8 w-8 text-indigo-400" />
             AUDIO RECAPS
          </h1>
          <p className="text-neutral-500 max-w-xl">
             Grace summarizes your recent study notes into short, intelligent "Masterclass" podcasts.
          </p>
        </div>
        <Button 
          onClick={generateRecap} 
          disabled={generating}
          className="bg-indigo-600 hover:bg-indigo-700 h-14 px-8 rounded-2xl font-black gap-3 shadow-xl shadow-indigo-600/20 group"
        >
          {generating ? <Loader2 className="h-5 w-5 animate-spin" /> : <Mic2 className="h-5 w-5 group-hover:scale-110 transition-transform" />}
          RECORD NEW BRIEFING
        </Button>
      </div>

      <Card className="bg-gradient-to-tr from-indigo-900/40 via-black to-purple-900/40 border-indigo-500/20 rounded-[3rem] overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-12 opacity-5">
             <Volume2 className="h-48 w-48 text-indigo-500" />
          </div>
          <CardContent className="p-12 md:p-16 flex flex-col md:flex-row items-center gap-12 relative z-10">
             <div className="h-40 w-40 rounded-[2.5rem] bg-indigo-600 shadow-[0_20px_60px_rgba(79,70,229,0.4)] flex items-center justify-center relative overflow-hidden shrink-0 group-hover:scale-105 transition-transform duration-500">
                <Sparkles className="h-16 w-16 text-white animate-pulse" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
             </div>
             
             <div className="space-y-6 flex-1 text-center md:text-left">
                <div className="space-y-3">
                   <div className="flex items-center justify-center md:justify-start gap-3">
                      <span className="px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-[10px] font-black uppercase tracking-widest text-indigo-400">Personalized Learning</span>
                      <span className="px-3 py-1 rounded-full bg-white/10 text-white text-[10px] font-black uppercase tracking-widest">Premium Only</span>
                   </div>
                   <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none italic uppercase">Grace's Audio Lab</h2>
                   <p className="text-neutral-400 text-lg max-w-xl leading-relaxed">
                      Listen to your weaknesses turned into spoken logic. Perfect for studying while commuting or resting.
                   </p>
                </div>
             </div>
          </CardContent>
      </Card>

      <div className="space-y-8">
         <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <h3 className="text-xl font-black text-white italic uppercase tracking-tighter flex items-center gap-3">
               <History className="h-5 w-5 text-indigo-400" />
               Your Audio Library
            </h3>
            <span className="text-xs font-bold text-neutral-500 uppercase tracking-widest">{recaps.length} Recordings</span>
         </div>

         {recaps.length === 0 ? (
            <div className="py-24 text-center border-2 border-dashed border-white/5 rounded-[3rem] space-y-4">
               <div className="h-16 w-16 bg-white/5 rounded-full flex items-center justify-center mx-auto">
                  <Headphones className="h-8 w-8 text-neutral-600" />
               </div>
               <p className="text-neutral-500 font-medium">No recaps yet. Hit the record button to generate your first briefing!</p>
            </div>
         ) : (
            <div className="grid gap-6">
               {recaps.map((recap, i) => (
                  <motion.div 
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: i * 0.05 }}
                     key={recap.id}
                  >
                     <Card className="glass-card rounded-[2rem] overflow-hidden group hover:border-indigo-500/30 transition-all border-white/5">
                        <CardContent className="p-8 flex flex-col md:flex-row items-center gap-8">
                           <div className="h-14 w-14 rounded-2xl bg-white/5 flex items-center justify-center text-neutral-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-lg border border-white/5">
                              <Volume2 className="h-6 w-6" />
                           </div>
                           
                           <div className="flex-1 space-y-1">
                              <div className="flex items-center gap-3">
                                 <h4 className="font-black text-white text-xl uppercase italic tracking-tighter">{recap.title}</h4>
                                 <span className="text-[10px] font-black text-neutral-500 bg-white/5 px-2 py-0.5 rounded border border-white/5">MP3</span>
                              </div>
                              <div className="flex items-center gap-4 text-[10px] text-neutral-500 font-bold uppercase tracking-widest">
                                 <span className="flex items-center gap-1.5"><Calendar className="h-3 w-3" /> {format(new Date(recap.created_at), 'MMM d, yyyy')}</span>
                                 <span className="h-1 w-1 rounded-full bg-neutral-800" />
                                 <span className="flex items-center gap-1.5"><Clock className="h-3 w-3" /> ~2 mins</span>
                              </div>
                           </div>

                           <div className="w-full md:w-96">
                              <PremiumAudioPlayer url={recap.audio_url} />
                           </div>
                        </CardContent>
                     </Card>
                  </motion.div>
               ))}
            </div>
         )}
      </div>
    </div>
  );
}
