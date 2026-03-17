"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useQuizStore } from "@/store/useQuizStore";
import api from "@/lib/axios";
import { toast } from "sonner";
import { Loader2, Zap, Clock, Mic, Target, Flame, Star, Layers, ArrowRight, CheckCircle, Info, Plus, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const SUBJECTS = [
  { id: "english", name: "English Language" },
  { id: "mathematics", name: "Mathematics" },
  { id: "physics", name: "Physics" },
  { id: "chemistry", name: "Chemistry" },
  { id: "biology", name: "Biology" },
  { id: "economics", name: "Economics" },
  { id: "government", name: "Government" },
  { id: "literature", name: "Literature-in-English" },
  { id: "commerce", name: "Commerce" },
  { id: "accounting", name: "Principles of Accounts" },
  { id: "crk", name: "Christian Religious Knowledge" },
  { id: "irk", name: "Islamic Religious Knowledge" },
  { id: "geography", name: "Geography" },
  { id: "civiceducation", name: "Civic Education" }
];

const MODES = [
  {
    id: "marathon",
    title: "JAMB Marathon",
    description: "4 subjects, 180 questions. The ultimate exam simulation with official timing.",
    icon: <Clock className="h-6 w-6 text-indigo-400" />,
    full: true,
    color: "from-indigo-600 to-purple-800",
    img: "/marathon_mode_icon_1773667014576.png"
  },
  {
    id: "voice",
    title: "Grace Guided",
    description: "AI-narrated session. Focus on understanding with instant spoken help.",
    icon: <Mic className="h-6 w-6 text-pink-400" />,
    color: "from-pink-600 to-indigo-900",
    img: "/voice_mode_icon_1773667051753.png"
  },
  {
    id: "redemption",
    title: "Redemption",
    description: "Practice only what you missed previously. Turn weaknesses into strengths.",
    icon: <Target className="h-6 w-6 text-orange-400" />,
    color: "from-orange-600 to-red-900",
    img: "/redemption_mode_icon_1773667066484.png"
  },
  {
    id: "sprint",
    title: "Topic Sprint",
    description: "15 questions, high intensity. Master one topic at a time in under 10 minutes.",
    icon: <Zap className="h-6 w-6 text-cyan-400" />,
    color: "from-cyan-600 to-blue-900",
    img: "/sprint_mode_icon_1773667034529.png"
  },
  {
    id: "boss",
    title: "Boss Level",
    description: "Only the toughest questions. 3 lives only—can you survive?",
    icon: <Flame className="h-6 w-6 text-red-500" />,
    color: "from-red-600 to-orange-900",
    img: "/hardcore_mode_icon_1773667083727.png"
  },
  {
    id: "random",
    title: "Randomized Run",
    description: "A surprise mix of questions to test your general readiness across topics.",
    icon: <Star className="h-6 w-6 text-yellow-400" />,
    color: "from-yellow-600 to-amber-900",
    img: "/streak_mode_icon_1773667096518.png"
  }
];

export default function ExamSetupPage() {
  const [selectedMode, setSelectedMode] = useState<string | null>(null);
  const [primarySubject, setPrimarySubject] = useState("english");
  const [extraSubjects, setExtraSubjects] = useState<string[]>([]);
  const [year, setYear] = useState("2020");
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const startQuiz = useQuizStore(state => state.startQuiz);

  // Toggle extra subject for Marathon
  const toggleSubject = (subId: string) => {
    if (subId === primarySubject) return; // Can't remove primary
    if (extraSubjects.includes(subId)) {
        setExtraSubjects(extraSubjects.filter(s => s !== subId));
    } else {
        if (extraSubjects.length < 3) {
            setExtraSubjects([...extraSubjects, subId]);
        } else {
            toast.error("JAMB Marathon requires exactly 4 subjects.");
        }
    }
  };

  const handleStart = async () => {
    if (!selectedMode) return;
    
    // Marathon validation
    if (selectedMode === 'marathon' && extraSubjects.length !== 3) {
        toast.error("Please select 3 additional subjects for JAMB Marathon.");
        return;
    }

    setLoading(true);
    try {
      const subjects = selectedMode === 'marathon' 
        ? [primarySubject, ...extraSubjects] 
        : [primarySubject];
      
      const res = await api.get(`/exams/questions/?subjects=${subjects.join(',')}&type=utme&year=${year}&mode=${selectedMode}`);
      const questionData = res.data.data;
      
      if (!questionData || questionData.length === 0) {
        toast.error("No questions found for this combination. Try 2020.");
        return;
      }

      const time = selectedMode === 'marathon' ? 120 * 60 : questionData.length * 60;
      
      startQuiz("UTME", subjects.length > 1 ? subjects : subjects[0], year, questionData, time, selectedMode);
      toast.success(`${MODES.find(m => m.id === selectedMode)?.title} mode activated!`);
      router.push("/exam");
    } catch (err: any) {
      toast.error("Failed to fetch questions. Please check your network.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tight flex items-center gap-3 italic uppercase">
             <Layers className="h-8 w-8 text-indigo-500" />
             Choose Your Arena
          </h1>
          <p className="text-neutral-500 max-w-xl font-medium">
             Select a learning mode designed to maximize your exam performance. 
             <span className="text-indigo-400"> Enterprise-grade logic active.</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MODES.map((mode) => (
          <motion.div
            key={mode.id}
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.98 }}
            className={`cursor-pointer group relative overflow-hidden rounded-[2.5rem] border transition-all duration-500 ${
              selectedMode === mode.id 
                ? "border-indigo-500 ring-2 ring-indigo-500/50 shadow-2xl bg-indigo-500/5" 
                : "border-white/5 hover:border-white/20 bg-white/[0.02]"
            } ${mode.full ? "md:col-span-2 lg:col-span-2" : ""}`}
            onClick={() => setSelectedMode(mode.id)}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${mode.color} opacity-10 group-hover:opacity-20 transition-opacity`} />
            
            {/* Hover Image Background Effect */}
            {mode.img && (
              <div className="absolute -right-20 -bottom-20 w-80 h-80 opacity-20 group-hover:opacity-100 group-hover:-right-10 group-hover:-bottom-10 transition-all duration-700 pointer-events-none">
                <motion.img 
                  src={mode.img} 
                  alt="" 
                  className="w-full h-full object-contain"
                  whileHover={{ scale: 1.2, rotate: -5 }}
                />
              </div>
            )}
            
            <Card className="bg-transparent border-0 h-full relative z-10 p-2">
              <CardContent className="p-8 flex flex-col h-full gap-4">
                 <div className="flex justify-between items-start">
                    <div className="h-14 w-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform relative overflow-hidden">
                       <div className="relative z-10">{mode.icon}</div>
                    </div>
                    {selectedMode === mode.id && (
                       <div className="bg-indigo-500 text-white rounded-full p-1 shadow-lg ring-4 ring-indigo-500/20">
                          <CheckCircle className="h-5 w-5" />
                       </div>
                    )}
                 </div>
                 
                 <div className="mt-4">
                    <h3 className="text-2xl font-black text-white mb-1 uppercase italic tracking-tighter">{mode.title}</h3>
                    <p className="text-neutral-400 text-sm leading-relaxed max-w-[320px] font-medium">
                       {mode.description}
                    </p>
                 </div>

                 <div className="mt-auto pt-6 flex flex-wrap gap-2">
                    {mode.id === 'marathon' ? (
                       <>
                         <StatBadge label="180 Questions" />
                         <StatBadge label="2.0 Hours" />
                         <StatBadge label="4 Subjects" />
                       </>
                    ) : (
                         <StatBadge label="AI Optimized" />
                    )}
                 </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedMode && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm"
              onClick={() => setSelectedMode(null)}
            />
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[100] w-full max-w-6xl px-6"
            >
              <div className="bg-neutral-900/90 backdrop-blur-3xl border border-indigo-500/30 p-8 rounded-[3.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.8)]" onClick={(e) => e.stopPropagation()}>
               
               <div className="flex flex-col lg:flex-row gap-8 items-end">
                  
                  {/* Subject Selection Area */}
                  <div className="flex-1 space-y-6 w-full">
                     <div className="flex items-center justify-between px-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-indigo-400 flex items-center gap-2">
                           <Layers className="h-3 w-3" />
                           {selectedMode === 'marathon' ? "Selection Required (Exactly 4)" : "Focus Subject"}
                        </Label>
                        {selectedMode === 'marathon' && (
                           <span className="text-[10px] font-black text-neutral-500">
                              {1 + extraSubjects.length} / 4 SELECTED
                           </span>
                        )}
                     </div>

                     <div className="flex flex-wrap gap-3">
                        {/* Always show English for JAMB Marathon if it's the rule, or let them pick primary */}
                        {SUBJECTS.map((sub) => {
                           const isPrimary = sub.id === primarySubject;
                           const isSelected = isPrimary || extraSubjects.includes(sub.id);
                           const isMarathon = selectedMode === 'marathon';

                           return (
                              <button
                                 key={sub.id}
                                 onClick={() => isMarathon ? toggleSubject(sub.id) : setPrimarySubject(sub.id)}
                                 className={`h-10 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                    isSelected 
                                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" 
                                    : "bg-white/5 border border-white/5 text-neutral-500 hover:border-white/20 hover:text-neutral-300"
                                 }`}
                              >
                                 {sub.name}
                              </button>
                           );
                        })}
                     </div>
                  </div>

                  {/* Year & Action */}
                  <div className="flex flex-col md:flex-row gap-6 w-full lg:w-auto items-end">
                     <div className="space-y-1.5 w-full md:w-32">
                        <Label className="text-[10px] uppercase tracking-widest font-black text-neutral-500 px-1">Mock Year</Label>
                        <Select value={year} onValueChange={(val) => val && setYear(val)}>
                           <SelectTrigger className="bg-white/5 border-white/5 h-14 text-white rounded-2xl focus:ring-indigo-500">
                              <SelectValue placeholder="Year" />
                           </SelectTrigger>
                           <SelectContent className="bg-neutral-900 border-white/10 text-white rounded-2xl">
                              {["2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022"].map(y => (
                                 <SelectItem key={y} value={y}>{y}</SelectItem>
                              ))}
                              <SelectItem value="random">Randomized</SelectItem>
                           </SelectContent>
                        </Select>
                     </div>

                     <Button 
                        onClick={handleStart} 
                        disabled={loading}
                        className="h-16 px-12 rounded-[1.5rem] bg-indigo-600 hover:bg-indigo-700 text-lg font-black group shadow-[0_20px_40px_rgba(79,70,229,0.3)] min-w-[240px] transition-all hover:scale-105 active:scale-95"
                     >
                        {loading ? <Loader2 className="animate-spin h-6 w-6" /> : (
                           <span className="flex items-center gap-2 italic uppercase">
                              START SESSION <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                           </span>
                        )}
                     </Button>
                  </div>
               </div>
            </div>
          </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatBadge({ label }: { label: string }) {
  return (
    <div className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/5 text-[9px] font-black uppercase tracking-widest text-neutral-400 group-hover:text-neutral-200 transition-colors">
      {label}
    </div>
  );
}
