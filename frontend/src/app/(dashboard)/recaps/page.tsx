"use client";

import { motion } from "framer-motion";
import { Headphones, Play, Sparkles, Filter, Calendar, BookOpen, Music, Share2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function RecapsPage() {
  const [isGenerating, setIsGenerating] = useState<number | null>(null);

  const recaps = [
    { id: 1, title: "Mathematics (UTME)", date: "Mar 16, 2026", duration: "12m 40s", questions: 40, errors: 12 },
    { id: 2, title: "Chemistry Mock Full", date: "Mar 15, 2026", duration: "15m 12s", questions: 50, errors: 8 },
    { id: 3, title: "English Grammar Sprint", date: "Mar 14, 2026", duration: "05m 20s", questions: 15, errors: 2 },
  ];

  const handleGenerate = (id: number) => {
    setIsGenerating(id);
    setTimeout(() => setIsGenerating(null), 3000);
  };

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
             <Headphones className="h-8 w-8 text-indigo-500" />
             AI Audio Recaps
          </h1>
          <p className="text-neutral-500">Listen to personalized "Exam Podcasts" that teach you everything you missed.</p>
        </div>
        <div className="flex gap-3">
           <Button variant="outline" className="h-14 px-6 rounded-2xl border-white/10 hover:bg-white/5 font-bold gap-2">
              <Filter className="h-4 w-4" /> Filter
           </Button>
        </div>
      </div>

      {/* Featured Recap / Now Playing */}
      <Card className="bg-gradient-to-tr from-indigo-600 via-indigo-950 to-black border-white/10 rounded-[3rem] overflow-hidden relative group">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />
         <CardContent className="p-12 md:p-16 flex flex-col md:flex-row items-center gap-12 relative z-10">
            <div className="h-48 w-48 rounded-[2rem] bg-indigo-500 shadow-2xl flex items-center justify-center relative overflow-hidden shrink-0 group-hover:scale-105 transition-transform duration-500">
               <Music className="h-20 w-20 text-white" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
            
            <div className="space-y-6 flex-1 text-center md:text-left">
               <div className="space-y-3">
                  <div className="flex flex-wrap justify-center md:justify-start gap-2">
                     <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[10px] font-black uppercase tracking-widest text-white">Recommended for you</span>
                     <span className="px-3 py-1 rounded-full bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest">New</span>
                  </div>
                  <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none">THE MATH DEEP-DIVE</h2>
                  <p className="text-indigo-200/60 text-lg max-w-xl">
                     A special 15-minute breakdown focusing on your common errors in <b>Differentiation and Integration</b> from today's simulation.
                  </p>
               </div>
               <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  <Button className="h-16 px-10 rounded-2xl bg-white text-indigo-950 hover:bg-indigo-50 text-lg font-black gap-3 shadow-[0_10px_30px_rgba(255,255,255,0.2)]">
                     <Play className="h-6 w-6 fill-indigo-950" />
                     PLAY NOW
                  </Button>
                  <Button variant="ghost" className="h-16 w-16 rounded-2xl border border-white/10 hover:bg-white/5 text-white p-0">
                     <Share2 className="h-6 w-6" />
                  </Button>
               </div>
            </div>
         </CardContent>
      </Card>

      <div className="space-y-6">
         <h3 className="text-2xl font-black text-white flex items-center gap-2">
            <Calendar className="h-6 w-6 text-indigo-400" />
            Previous Session Recaps
         </h3>
         
         <div className="grid gap-4">
            {recaps.map((run) => (
              <motion.div key={run.id} whileHover={{ x: 10 }} className="group">
                 <Card className="bg-black/40 border-white/10 backdrop-blur-md rounded-2xl transition-all hover:bg-white/5 hover:border-indigo-500/30 overflow-hidden">
                    <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                       <div className="flex items-center gap-6">
                          <div className="h-12 w-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                             <Headphones className="h-6 w-6" />
                          </div>
                          <div>
                             <h4 className="font-bold text-white text-lg">{run.title} Recap</h4>
                             <div className="flex items-center gap-3 text-xs text-neutral-500 font-medium">
                                <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {run.date}</span>
                                <span className="h-1 w-1 rounded-full bg-neutral-700" />
                                <span className="flex items-center gap-1 font-bold text-neutral-400 underline decoration-indigo-500/50">{run.errors} Mistake Lessons</span>
                             </div>
                          </div>
                       </div>
                       
                       <div className="flex items-center gap-6">
                          <div className="text-right hidden md:block">
                             <div className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Duration</div>
                             <div className="text-sm font-bold text-white">{run.duration}</div>
                          </div>
                          <Button 
                            onClick={() => handleGenerate(run.id)}
                            disabled={isGenerating === run.id}
                            className="h-12 px-6 rounded-xl bg-white/5 border border-white/10 hover:bg-indigo-600 hover:text-white transition-all font-bold min-w-[140px]"
                          >
                             {isGenerating === run.id ? (
                               <span className="flex items-center gap-2 italic text-xs animate-pulse text-indigo-400">
                                  <Sparkles className="h-4 w-4 animate-spin" /> Analyzing...
                               </span>
                             ) : "Listen Recap"}
                          </Button>
                       </div>
                    </CardContent>
                 </Card>
              </motion.div>
            ))}
         </div>
      </div>
    </div>
  );
}
