"use client";

import { motion } from "framer-motion";
import { CalendarRange, Sparkles, Plus, Clock, BookOpen, Volume2, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function PlannerPage() {
  const schedule = [
    { time: "08:00 AM", task: "Physics: Wave Optics", status: "completed" },
    { time: "10:30 AM", task: "Chemistry: Organic Compounds", status: "current" },
    { time: "02:00 PM", task: "Math: Calculus Mock Run", status: "pending" },
    { time: "04:30 PM", task: "English: Comprehension Drill", status: "pending" },
  ];

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
             <CalendarRange className="h-8 w-8 text-indigo-500" />
             AI Study Planner
          </h1>
          <p className="text-neutral-500">A schedule hand-crafted by AI to maximize your weak point recovery.</p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700 h-14 px-8 rounded-22xl font-bold gap-2 shadow-[0_0_20px_rgba(79,70,229,0.3)] rounded-2xl">
           <Volume2 className="h-5 w-5" />
           Brief Me for Today
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 space-y-6">
            <Card className="bg-black/40 border-white/10 backdrop-blur-md rounded-[2.5rem] overflow-hidden">
               <div className="bg-white/5 px-8 py-4 border-b border-white/5 flex items-center justify-between">
                  <h3 className="font-black uppercase tracking-widest text-[10px] text-neutral-400">Monday, March 16</h3>
                  <Sparkles className="h-4 w-4 text-indigo-500" />
               </div>
               <CardContent className="p-8 space-y-6">
                  {schedule.map((item, i) => (
                    <div key={i} className="flex items-center gap-6 group">
                       <div className="w-20 shrink-0 text-sm font-black text-neutral-500">{item.time}</div>
                       <div className="h-10 w-[2px] bg-white/5 relative">
                          <div className={cn(
                            "absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full border-2 border-neutral-900 shadow-xl",
                            item.status === 'completed' ? 'bg-emerald-500' : item.status === 'current' ? 'bg-indigo-500' : 'bg-neutral-800'
                          )} />
                       </div>
                       <div className={cn(
                         "flex-1 p-5 rounded-2xl border transition-all",
                         item.status === 'current' ? 'bg-indigo-500/10 border-indigo-500/30 ring-1 ring-indigo-500/20' : 'bg-white/5 border-white/5'
                       )}>
                          <div className="flex items-center justify-between">
                             <div className="space-y-1">
                                <h4 className="font-bold text-white tracking-tight">{item.task}</h4>
                                <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">
                                   Estimated: 45 Minutes
                                </p>
                             </div>
                             {item.status === 'completed' && <CheckCircle2 className="h-5 w-5 text-emerald-500" />}
                          </div>
                       </div>
                    </div>
                  ))}
               </CardContent>
            </Card>
         </div>

         <div className="space-y-6">
            <Card className="bg-gradient-to-br from-indigo-900/20 to-black border-indigo-500/10 rounded-[2.5rem] p-8 space-y-6">
               <div className="h-12 w-12 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-indigo-400" />
               </div>
               <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white">Why this plan?</h3>
                  <p className="text-sm text-neutral-400 leading-relaxed">
                     Grace noticed your scores dip during the afternoon. I've placed your strongest subject (Physics) in the morning and a low-intensity drill at 4 PM to keep you fresh.
                  </p>
               </div>
               <Button variant="outline" className="w-full h-12 rounded-xl border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/10 font-bold">
                  Reshuffle Plan
               </Button>
            </Card>

            <Card className="bg-black/40 border-white/10 backdrop-blur-md rounded-[2.5rem] p-8">
               <h3 className="text-white font-bold mb-4">Milestone Tracker</h3>
               <div className="space-y-4">
                  <div className="space-y-2">
                     <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-neutral-500">
                        <span>UTME Coverage</span>
                        <span>62%</span>
                     </div>
                     <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full w-[62%] bg-indigo-500 rounded-full" />
                     </div>
                  </div>
               </div>
            </Card>
         </div>
      </div>
    </div>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
