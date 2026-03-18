"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CalendarRange, Sparkles, Clock, BookOpen, 
  CheckCircle2, Loader2, Wand2, Calendar,
  ChevronRight, Target, BrainCircuit
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { toast } from "sonner";

interface StudyDay {
  day_number: number;
  subject: string;
  tasks: string[];
  goal: string;
}

interface Plan {
  id: string;
  title: string;
  content: StudyDay[];
  created_at: string;
}

export default function PlannerPage() {
  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [showSetup, setShowSetup] = useState(false);
  
  // Setup form states
  const [examType, setExamType] = useState("jamb");
  const [targetDate, setTargetDate] = useState("");

  const fetchPlan = async () => {
    try {
      const res = await fetch("/api/ai/planner");
      const data = await res.json();
      if (res.ok && data.id) {
        setPlan(data);
      } else {
        setShowSetup(true);
      }
    } catch (err) {
      toast.error("Failed to load study plan");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlan();
  }, []);

  const generatePlan = async () => {
    if (!targetDate) {
      toast.error("Please select a target exam date.");
      return;
    }

    setGenerating(true);
    try {
      const res = await fetch("/api/ai/planner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ examType, targetDate })
      });
      const data = await res.json();
      
      if (!res.ok) {
        toast.error(data.error || "Generation failed");
        return;
      }

      setPlan({
          id: 'temp', // Refresh will get real ID
          title: data.plan_title,
          content: data.days,
          created_at: new Date().toISOString()
      });
      setShowSetup(false);
      toast.success("Grace has calculated your new path!");
    } catch (err) {
      toast.error("Network error during generation");
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <Loader2 className="h-10 w-10 text-indigo-500 animate-spin" />
        <p className="text-neutral-400">Loading your master schedule...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white flex items-center gap-3">
             <CalendarRange className="h-7 w-7 md:h-8 md:w-8 text-indigo-400" />
             AI STUDY PLANNER
          </h1>
          <p className="text-sm md:text-base text-neutral-500">Your path to exam dominance, recalculated by Grace based on your weak points.</p>
        </div>
        {!showSetup && (
          <Button 
            onClick={() => setShowSetup(true)}
            variant="outline"
            className="rounded-xl border-white/10 hover:bg-white/5 gap-2 h-12"
          >
            <Wand2 className="h-4 w-4" />
            Regenerate Plan
          </Button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {showSetup ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            key="setup"
          >
            <Card className="glass-card max-w-2xl mx-auto rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 border-indigo-500/20 relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />
               <CardHeader className="p-0 mb-8">
                  <CardTitle className="text-2xl font-black text-white italic">PLAN CONFIGURATION</CardTitle>
                  <CardDescription>Customize your 7-day intensive sprint based on your goals.</CardDescription>
               </CardHeader>
               <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest text-neutral-500">EXAM CATEGORY</Label>
                    <Select value={examType} onValueChange={(v) => v && setExamType(v)}>
                      <SelectTrigger className="bg-black/20 border-white/10 h-12 rounded-xl text-white">
                        <SelectValue placeholder="Select Exam" />
                      </SelectTrigger>
                      <SelectContent className="bg-neutral-900 border-white/10">
                        <SelectItem value="jamb">JAMB (UTME)</SelectItem>
                        <SelectItem value="waec">WAEC (WASSCE)</SelectItem>
                        <SelectItem value="neco">NECO</SelectItem>
                        <SelectItem value="post-utme">Post-UTME</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest text-neutral-500">TARGET EXAM DATE</Label>
                    <Input 
                      type="date" 
                      value={targetDate}
                      onChange={(e) => setTargetDate(e.target.value)}
                      className="bg-black/20 border-white/10 h-12 rounded-xl text-white" 
                    />
                  </div>
                  <div className="pt-4 flex gap-4">
                     <Button 
                        onClick={generatePlan} 
                        disabled={generating}
                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 h-14 rounded-2xl font-black shadow-lg shadow-indigo-600/20"
                     >
                        {generating ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Sparkles className="mr-2 h-5 w-5" />}
                        GENERATE 7-DAY SPRINT
                     </Button>
                     {plan && (
                       <Button 
                         variant="ghost" 
                         onClick={() => setShowSetup(false)}
                         className="h-14 px-8 rounded-2xl text-neutral-400 hover:text-white"
                       >
                         Cancel
                       </Button>
                     )}
                  </div>
               </div>
            </Card>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            key="plan"
            className="space-y-8"
          >
            {/* Strategy Insight */}
            <Card className="bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border border-indigo-500/20 rounded-2xl md:rounded-[2rem] p-6 md:p-8 flex items-center md:items-start lg:items-center gap-4 md:gap-6 relative overflow-hidden backdrop-blur-md">
               <div className="h-12 w-12 md:h-16 md:w-16 rounded-xl md:rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
                  <BrainCircuit className="h-6 w-6 md:h-8 md:w-8 text-indigo-300" />
               </div>
               <div>
                  <h3 className="font-bold text-base md:text-lg text-white">Grace's Strategy: {plan?.title}</h3>
                  <p className="text-xs md:text-sm text-indigo-200/70 mt-1 max-w-3xl leading-relaxed">
                    This plan focuses on bridging your identified gaps while maintaining momentum in your strong subjects. 
                    I've ordered tasks by mental load.
                  </p>
               </div>
            </Card>

            <div className="grid gap-6">
               {plan?.content.map((day, i) => (
                 <motion.div 
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ delay: i * 0.1 }}
                   key={i}
                >
                   <Card className="glass-card rounded-[2.5rem] overflow-hidden group hover:border-indigo-500/30 transition-all">
                      <div className="flex flex-col md:flex-row">
                         <div className="md:w-64 bg-white/5 p-6 md:p-8 flex flex-col justify-center border-b md:border-b-0 md:border-r border-white/5">
                            <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Day 0{day.day_number}</span>
                            <h4 className="text-xl md:text-2xl font-black text-white mt-1 uppercase italic tracking-tighter">{day.subject}</h4>
                            <div className="mt-4 flex items-center gap-2 text-indigo-400 text-[10px] font-bold uppercase tracking-widest bg-indigo-500/10 w-fit px-3 py-1 rounded-full border border-indigo-500/10">
                               <Target className="h-3 w-3" /> Focus Goal
                            </div>
                         </div>
                         <div className="flex-1 p-6 md:p-8 grid sm:grid-cols-2 gap-6 md:gap-8 items-center">
                            <div className="space-y-4">
                               {day.tasks.map((task, ti) => (
                                 <div key={ti} className="flex items-start gap-3 group/task">
                                    <div className="h-5 w-5 rounded-full border border-white/10 mt-0.5 flex items-center justify-center group-hover/task:border-indigo-500 transition-colors">
                                       <div className="h-1 w-1 bg-white/20 rounded-full group-hover/task:bg-indigo-500 transition-colors" />
                                    </div>
                                    <p className="text-sm text-neutral-300 font-medium">{task}</p>
                                 </div>
                               ))}
                            </div>
                            <div className="bg-white/[0.02] rounded-2xl md:rounded-3xl p-5 md:p-6 border border-white/5">
                               <span className="text-[9px] font-black uppercase tracking-widest text-neutral-500 block mb-2">END OF DAY GOAL</span>
                               <p className="text-sm text-indigo-200/80 font-semibold italic">&ldquo;{day.goal}&rdquo;</p>
                            </div>
                         </div>
                         <div className="p-8 flex items-center justify-center border-t md:border-t-0 md:border-l border-white/5">
                            <Button size="icon" variant="ghost" className="rounded-2xl h-12 w-12 hover:bg-indigo-500/20 text-indigo-400">
                               <CheckCircle2 className="h-6 w-6" />
                            </Button>
                         </div>
                      </div>
                   </Card>
                 </motion.div>
               ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
