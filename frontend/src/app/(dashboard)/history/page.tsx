"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { format } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Calendar, BookOpen, Target, CheckCircle, ChevronRight, History, Sparkles } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AttemptDetailModal } from "@/components/AttemptDetailModal";
import { Button } from "@/components/ui/button";

import { HistoryRowSkeleton } from "@/components/ui/skeleton-premium";

interface Attempt {
  id: number;
  exam_type: string;
  subject: string;
  year: string;
  score: number;
  total_questions: number;
  date_attempted: string;
}

export default function HistoryPage() {
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAttemptId, setSelectedAttemptId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get("/exams/history/");
        setAttempts(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const { user } = useAuthStore();
  const router = useRouter();

  const handleOpenDetail = (id: number) => {
    if (user?.subscription_tier !== 'PAID') {
      toast.error("Premium Feature", {
        description: "Upgrade to Premium to revisit specific questions and hear Grace's analysis!"
      });
      router.push('/subscription');
      return;
    }
    setSelectedAttemptId(id);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="space-y-10 pb-20">
        <div className="space-y-2">
          <div className="skeleton h-10 w-64" />
          <div className="skeleton h-4 w-96" />
        </div>
        <div className="glass-card rounded-[2.5rem] overflow-hidden">
          <div className="p-8 border-b border-white/5">
            <div className="skeleton h-6 w-48" />
          </div>
          {[1, 2, 3, 4].map((i) => (
            <HistoryRowSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tight flex items-center gap-3 italic uppercase italic">
             <History className="h-8 w-8 text-indigo-500" />
             Battle Logs
          </h1>
          <p className="text-neutral-500">Analyze your previous Arena runs and hear Grace's advice on each mistake.</p>
        </div>
      </div>

      <Card className="bg-black/40 border-white/10 backdrop-blur-md rounded-[2.5rem] overflow-hidden">
        <CardHeader className="p-8 border-b border-white/5 bg-white/[0.02]">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
               <CardTitle className="text-xl font-bold">Recent Run History</CardTitle>
               <CardDescription>Click any session to start a deep-dive review with AI coaching.</CardDescription>
            </div>
            <Sparkles className="h-5 w-5 text-indigo-500/40" />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {attempts.length === 0 ? (
            <div className="text-center py-20 text-neutral-500">
              <BookOpen className="h-16 w-16 mx-auto mb-4 opacity-10" />
              <p className="font-medium">The logs are empty. Enter the Arena to start tracking.</p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {attempts.map((attempt) => {
                const percentage = Math.round((attempt.score / attempt.total_questions) * 100) || 0;
                let scoreColor = "text-red-400";
                let bgColor = "bg-red-500/10";
                let borderColor = "border-red-500/20";
                
                if (percentage >= 70) {
                  scoreColor = "text-emerald-400";
                  bgColor = "bg-emerald-500/10";
                  borderColor = "border-emerald-500/20";
                } else if (percentage >= 50) {
                  scoreColor = "text-amber-400";
                  bgColor = "bg-amber-500/10";
                  borderColor = "border-amber-500/20";
                }

                return (
                  <div 
                    key={attempt.id} 
                    className="p-8 hover:bg-white/[0.03] transition-all cursor-pointer group flex flex-col md:flex-row md:items-center justify-between gap-8"
                    onClick={() => handleOpenDetail(attempt.id)}
                  >
                    <div className="flex items-start gap-6">
                      <div className={`h-16 w-16 rounded-2xl flex items-center justify-center ${bgColor} border ${borderColor} shrink-0 shadow-lg group-hover:scale-105 transition-transform`}>
                        <CheckCircle className={`h-8 w-8 ${scoreColor}`} />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                           <h3 className="font-black text-xl text-white capitalize italic">{attempt.subject}</h3>
                           <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-neutral-400">{attempt.exam_type}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-neutral-400 font-medium">
                          <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> {format(new Date(attempt.date_attempted), "MMM d, yyyy • h:mm a")}</span>
                          <span className="h-1 w-1 rounded-full bg-neutral-700" />
                          <span className="flex items-center gap-1.5"><Target className="h-3.5 w-3.5" /> Year {attempt.year}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-12">
                      <div className="flex items-center gap-10">
                         <div className="text-right">
                           <div className={`text-3xl font-black tracking-tighter ${scoreColor}`}>
                             {attempt.score}<span className="text-sm text-neutral-500 font-normal">/{attempt.total_questions}</span>
                           </div>
                           <div className="text-[9px] text-neutral-500 font-black tracking-widest uppercase">Score</div>
                         </div>
                         <div className="text-right">
                           <div className={`text-2xl font-bold ${scoreColor}`}>{percentage}%</div>
                           <div className="text-[9px] text-neutral-500 font-black tracking-widest uppercase">Rank</div>
                         </div>
                      </div>
                      <div className="h-10 w-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-neutral-500 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-500 transition-all">
                         <ChevronRight className="h-5 w-5" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <AttemptDetailModal 
        attemptId={selectedAttemptId}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
