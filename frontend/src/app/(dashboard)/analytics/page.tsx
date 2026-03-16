"use client";

import { motion } from "framer-motion";
import { BrainCircuit, Play, Sparkles, TrendingUp, AlertTriangle, CheckCircle, Headphones } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PremiumAudioPlayer } from "@/components/PremiumAudioPlayer";
import { useState } from "react";

export default function AnalyticsPage() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="space-y-10 pb-20">
      <div className="space-y-2">
        <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
           <BrainCircuit className="h-8 w-8 text-indigo-500" />
           Grace's AI Insights
        </h1>
        <p className="text-neutral-500">Your performance analyzed through the lens of emotional intelligence.</p>
      </div>

      {/* Grace's Verdict Card */}
      <Card className="bg-gradient-to-br from-indigo-900/40 via-black to-purple-900/40 border-indigo-500/20 rounded-[3rem] overflow-hidden relative">
         <div className="absolute top-0 right-0 p-8">
            <Sparkles className="h-12 w-12 text-indigo-500/20" />
         </div>
         <CardContent className="p-12 flex flex-col md:flex-row gap-12 items-center">
            <div className="shrink-0">
               <div className="h-40 w-40 rounded-full bg-indigo-500/10 border-4 border-indigo-500/20 flex items-center justify-center relative">
                  <motion.div 
                    animate={{ scale: [1, 1.1, 1] }} 
                    transition={{ repeat: Infinity, duration: 4 }}
                    className="absolute inset-0 rounded-full bg-indigo-500/5"
                  />
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Grace" alt="Grace" className="h-32 w-32 relative z-10" />
               </div>
            </div>
            
            <div className="space-y-6 flex-1 text-center md:text-left">
               <div className="space-y-2">
                  <h3 className="text-3xl font-black text-white">"You're making progress, but Chemistry is still playing hard to get."</h3>
                  <p className="text-neutral-400 text-lg leading-relaxed">
                     Grace has analyzed your last 5 attempts. Your speed in Mathematics is top-tier, but you tend to rush through Periodic Table questions.
                  </p>
               </div>
               <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  <Button className="h-14 px-8 rounded-2xl bg-indigo-600 hover:bg-indigo-700 font-bold gap-2">
                     <Headphones className="h-5 w-5" />
                     Listen to Full Verdict
                  </Button>
                  <Button variant="outline" className="h-14 px-8 rounded-2xl border-white/10 hover:bg-white/5 font-bold">
                     Show Detailed Stats
                  </Button>
               </div>
            </div>
         </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-6">
         <InsightCard 
           title="Speed Score" 
           value="8.2s" 
           sub="Per question"
           icon={<TrendingUp className="h-5 w-5 text-emerald-400" />}
           desc="You are faster than 82% of students. Slow down on Biology!"
         />
         <InsightCard 
           title="Weak Point" 
           value="Integration" 
           sub="Mathematics"
           icon={<AlertTriangle className="h-5 w-5 text-orange-400" />}
           desc="Focus on chain rule—you missed 4 questions here today."
         />
         <InsightCard 
           title="Success Rate" 
           value="72%" 
           sub="Overall Avg"
           icon={<CheckCircle className="h-5 w-5 text-indigo-400" />}
           desc="Up 5% from last week. You are on track for 280+ JAMB score."
         />
      </div>
    </div>
  );
}

function InsightCard({ title, value, sub, icon, desc }: any) {
  return (
    <Card className="bg-black/40 border-white/10 backdrop-blur-md rounded-[2rem] p-8 space-y-4 hover:border-indigo-500/20 transition-all">
       <div className="flex items-center justify-between">
          <div className="text-[10px] font-black uppercase tracking-widest text-neutral-500">{title}</div>
          {icon}
       </div>
       <div>
          <div className="text-4xl font-black text-white">{value}</div>
          <div className="text-xs text-neutral-500 font-bold uppercase">{sub}</div>
       </div>
       <p className="text-sm text-neutral-400 leading-relaxed border-t border-white/5 pt-4">
          {desc}
       </p>
    </Card>
  );
}
