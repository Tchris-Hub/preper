"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useQuizStore } from "@/store/useQuizStore";
import api from "@/lib/axios";
import { toast } from "sonner";
import { Loader2, Zap, Clock, Mic, Target, Flame, Star, Layers, ArrowRight, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const SUBJECTS = ["english", "mathematics", "physics", "chemistry", "biology", "economics", "government", "literature", "commerce", "accounting", "crk", "irk", "geography", "civiceducation"];

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
    id: "daily",
    title: "Daily Streak",
    description: "5 random questions to keep your brain sharp and your streak alive.",
    icon: <Star className="h-6 w-6 text-yellow-400" />,
    color: "from-yellow-600 to-amber-900",
    img: "/streak_mode_icon_1773667096518.png"
  }
];

export default function ExamSetupPage() {
  const [selectedMode, setSelectedMode] = useState<string | null>(null);
  const [subject, setSubject] = useState("english");
  const [year, setYear] = useState("2020");
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const startQuiz = useQuizStore(state => state.startQuiz);

  const handleStart = async () => {
    if (!selectedMode) return;
    setLoading(true);
    try {
      const res = await api.get(`/exams/questions/?subject=${subject}&type=utme&year=${year}`);
      const questionData = res.data.data;
      
      if (!questionData || questionData.length === 0) {
        toast.error("No questions found. Try 2020 or English.");
        return;
      }

      const time = selectedMode === 'marathon' ? 120 * 60 : questionData.length * 60;
      
      startQuiz("UTME", subject, year, questionData, time, selectedMode);
      toast.success(`${selectedMode.toUpperCase()} mode activated! Good luck.`);
      router.push("/exam");
    } catch (err: any) {
      toast.error("Failed to fetch questions.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
             <Layers className="h-8 w-8 text-indigo-500" />
             Choose Your Arena
          </h1>
          <p className="text-neutral-500 max-w-xl">
             Select a learning mode designed to maximize your exam confidence and performance.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MODES.map((mode) => (
          <motion.div
            key={mode.id}
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.98 }}
            className={`cursor-pointer group relative overflow-hidden rounded-[2.5rem] border transition-all duration-300 ${
              selectedMode === mode.id 
                ? "border-indigo-500 ring-2 ring-indigo-500/50 shadow-2xl" 
                : "border-white/5 hover:border-white/20"
            } ${mode.full ? "md:col-span-2 lg:col-span-2" : ""}`}
            onClick={() => setSelectedMode(mode.id)}
          >
            {/* Background Texture / Glow */}
            <div className={`absolute inset-0 bg-gradient-to-br ${mode.color} opacity-20 group-hover:opacity-30 transition-opacity`} />
            
            {/* The Actual Image - Faded background */}
            {mode.img && (
                <div 
                    className="absolute -right-8 -bottom-8 w-64 h-64 bg-no-repeat bg-contain opacity-10 group-hover:opacity-20 transition-all group-hover:scale-110 group-hover:-rotate-6 pointer-events-none"
                    style={{ backgroundImage: `url(${mode.img})` }}
                />
            )}

            <Card className="bg-transparent border-0 h-full relative z-10">
              <CardContent className="p-8 flex flex-col h-full gap-4">
                 <div className="flex justify-between items-start">
                    <div className="h-14 w-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                       {mode.icon}
                    </div>
                    {selectedMode === mode.id && (
                       <div className="bg-indigo-500 text-white rounded-full p-1 shadow-lg">
                          <CheckCircle className="h-5 w-5" />
                       </div>
                    )}
                 </div>
                 
                 <div className="mt-4">
                    <h3 className="text-2xl font-black text-white mb-1 group-hover:text-indigo-300 transition-colors uppercase italic">{mode.title}</h3>
                    <p className="text-neutral-400 text-sm leading-relaxed max-w-[280px]">
                       {mode.description}
                    </p>
                 </div>

                 <div className="mt-auto pt-6 flex flex-wrap gap-2">
                    {mode.full ? (
                       <>
                         <StatBadge label="180 Questions" />
                         <StatBadge label="2.0 Hours" />
                         <StatBadge label="4 Subjects" />
                       </>
                    ) : (
                        <StatBadge label="Personalized" />
                    )}
                 </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedMode && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[100] w-full max-w-4xl px-6"
          >
            <div className="bg-neutral-900/80 backdrop-blur-3xl border border-indigo-500/30 p-5 rounded-[3.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.7)] flex flex-col md:flex-row items-center gap-6">
               <div className="flex-1 grid grid-cols-2 gap-4 w-full">
                  <div className="space-y-1.5">
                     <p className="text-[10px] uppercase tracking-widest font-black text-indigo-400 px-1">Primary Subject</p>
                     <Select value={subject} onValueChange={(val) => setSubject(val || "english")}>
                       <SelectTrigger className="bg-white/5 border-white/5 h-12 text-white capitalize rounded-[1.25rem] focus:ring-indigo-500">
                          <SelectValue />
                       </SelectTrigger>
                       <SelectContent className="bg-neutral-900 border-white/10 text-white rounded-xl">
                         {SUBJECTS.map(s => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
                       </SelectContent>
                     </Select>
                  </div>
                  <div className="space-y-1.5">
                     <p className="text-[10px] uppercase tracking-widest font-black text-indigo-400 px-1">Mock Year</p>
                     <Select value={year} onValueChange={(val) => setYear(val || "2020")}>
                       <SelectTrigger className="bg-white/5 border-white/5 h-12 text-white rounded-[1.25rem] focus:ring-indigo-500">
                          <SelectValue />
                       </SelectTrigger>
                       <SelectContent className="bg-neutral-900 border-white/10 text-white rounded-xl">
                         {["2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022"].map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                         <SelectItem value="random">Randomized</SelectItem>
                       </SelectContent>
                     </Select>
                  </div>
               </div>
               
               <Button 
                onClick={handleStart} 
                disabled={loading}
                className="h-16 px-12 rounded-[1.5rem] bg-indigo-600 hover:bg-indigo-700 text-lg font-black group shadow-[0_0_40px_rgba(79,70,229,0.4)] min-w-[220px] transition-all hover:scale-105 active:scale-95"
               >
                 {loading ? <Loader2 className="animate-spin h-6 w-6" /> : (
                   <span className="flex items-center gap-2">
                     ENTER ARENA <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                   </span>
                 )}
               </Button>
            </div>
          </motion.div>
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
