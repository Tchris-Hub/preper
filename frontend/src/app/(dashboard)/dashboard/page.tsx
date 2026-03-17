"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, BookOpen, PlayCircle, Activity, History as HistoryIcon, Sparkles, TrendingUp } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { StatCardSkeleton, DashboardCardSkeleton } from "@/components/ui/skeleton-premium";

interface Profile {
  id: string;
  username: string | null;
  full_name: string | null;
  email: string | null;
  subscription_tier: string;
}

interface ExamAttempt {
  id: string;
  subject: string;
  exam_type: string;
  score: number;
  total_questions: number;
  percentage: number;
  created_at: string;
}

export default function DashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [recentAttempts, setRecentAttempts] = useState<ExamAttempt[]>([]);
  const [stats, setStats] = useState({ totalExams: 0, avgScore: 0, bestSubject: "—" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const supabase = createClient();

      // Get user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileData) setProfile(profileData);

      // Fetch recent exam attempts (last 5)
      const { data: attempts } = await supabase
        .from("exam_attempts")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);

      if (attempts && attempts.length > 0) {
        setRecentAttempts(attempts);

        // Calculate stats from ALL attempts
        const { data: allAttempts } = await supabase
          .from("exam_attempts")
          .select("subject, score, total_questions");

        if (allAttempts && allAttempts.length > 0) {
          const totalExams = allAttempts.length;
          const avgScore = Math.round(
            allAttempts.reduce((sum, a) => sum + (a.score / a.total_questions) * 100, 0) / totalExams
          );

          // Find best subject
          const subjectScores: Record<string, { total: number; count: number }> = {};
          allAttempts.forEach((a) => {
            if (!subjectScores[a.subject]) subjectScores[a.subject] = { total: 0, count: 0 };
            subjectScores[a.subject].total += (a.score / a.total_questions) * 100;
            subjectScores[a.subject].count++;
          });

          let bestSubject = "—";
          let bestAvg = 0;
          Object.entries(subjectScores).forEach(([subject, data]) => {
            const avg = data.total / data.count;
            if (avg > bestAvg) {
              bestAvg = avg;
              bestSubject = subject;
            }
          });

          setStats({ totalExams, avgScore, bestSubject: `${bestSubject} (${Math.round(bestAvg)}%)` });
        }
      }

      setLoading(false);
    };

    fetchDashboardData();
  }, []);

  const isFree = profile?.subscription_tier === "free";
  const displayName = profile?.full_name || profile?.username || "Student";

  if (loading) {
    return (
      <div className="space-y-8 pb-20">
        <div className="space-y-2">
          <div className="skeleton h-9 w-72" />
          <div className="skeleton h-4 w-96" />
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>
        <div className="grid gap-8 md:grid-cols-2">
          <DashboardCardSkeleton />
          <DashboardCardSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white">Welcome, {displayName}!</h1>
          <p className="text-neutral-400 mt-1">Here is the latest on your mission to success.</p>
        </div>
        <Link href="/setup">
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl rounded-xl h-12 px-6 font-bold">
            <PlayCircle className="mr-2 h-5 w-5" /> Start Practice
          </Button>
        </Link>
      </div>

      {isFree && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border border-indigo-500/20 rounded-[2rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden backdrop-blur-md">
          <div className="absolute top-0 left-0 w-2 bg-gradient-to-b from-indigo-500 to-purple-500 h-full"></div>
          <div>
            <h3 className="font-bold text-xl text-indigo-50">Free Tier Active</h3>
            <p className="text-sm text-indigo-200/70 mt-1 max-w-md leading-relaxed">
              Upgrade to <b>Ace Unlimited</b> to unlock the AI Tutor and Voice Coaching.
            </p>
          </div>
          <Link href="/subscription">
            <Button className="bg-white text-indigo-950 hover:bg-indigo-50 font-black rounded-xl px-8 h-12 whitespace-nowrap shadow-xl">
              Get Unlimited Access
            </Button>
          </Link>
        </motion.div>
      )}

      <motion.div 
        initial="hidden"
        animate="visible"
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
        className="grid gap-6 md:grid-cols-3"
      >
        <StatCard 
          title="Total Exams" 
          value={stats.totalExams.toString()} 
          sub={stats.totalExams === 0 ? "Take your first exam!" : "All time"} 
          icon={<Activity className="h-4 w-4 text-indigo-400" />} 
        />
        <StatCard 
          title="Average Score" 
          value={stats.totalExams > 0 ? `${stats.avgScore}%` : "—"} 
          sub="Across all subjects" 
          icon={<TrendingUp className="h-4 w-4 text-emerald-400" />} 
        />
        <StatCard 
          title="Strongest Subject" 
          value={stats.bestSubject.split(" (")[0]} 
          sub={stats.bestSubject.includes("(") ? stats.bestSubject.split(" (")[1].replace(")", "") + " average" : "Complete exams to find out"} 
          color="text-purple-400" 
          icon={<BookOpen className="h-4 w-4 text-purple-400" />} 
        />
      </motion.div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Capability Showcase */}
        <Card className="glass-card rounded-[2.5rem] overflow-hidden flex flex-col">
           <div className="bg-indigo-600/20 px-8 py-3 text-[10px] font-black uppercase tracking-widest text-indigo-400 border-b border-indigo-500/10">
              Project Intelligence Overview
           </div>
          <CardHeader className="p-8 pb-4">
            <CardTitle className="text-2xl font-black tracking-tight text-white flex items-center gap-3">
               <Sparkles className="h-6 w-6 text-indigo-400 animate-pulse" />
               Your AI Superpowers
            </CardTitle>
            <CardDescription className="text-neutral-400 text-sm">Everything you need to crush your JAMB/WAEC goals.</CardDescription>
          </CardHeader>
          <CardContent className="p-8 pt-4 space-y-4 flex-1">
             <FeatureRow 
               title="Grace: AI Study Sister" 
               status="Online" 
               desc="Spoken explanations with local Nigerian context."
               color="text-indigo-400"
             />
             <FeatureRow 
               title="Multilingual Coaching" 
               status="Active" 
               desc="Explanations in Pidgin, Yoruba, Igbo, and Hausa."
               color="text-purple-400"
             />
             <FeatureRow 
               title="Personal Voice Cloning" 
               status="Premium" 
               desc="Study using your favorite teacher's real voice."
               color="text-pink-400"
             />
              <FeatureRow 
               title="Mistake Redemption" 
               status="New" 
               desc="Smart loop system to fix your consistent errors."
               color="text-emerald-400"
             />
          </CardContent>
          <div className="p-8 pt-0 mt-auto">
             <Link href="/notebook">
                <Button variant="outline" className="w-full border-white/10 hover:bg-white/5 rounded-xl text-neutral-400 hover:text-white transition-all h-12">
                   Open Study Notebook
                </Button>
             </Link>
          </div>
        </Card>

        {/* Recent Activity — REAL DATA */}
        <Card className="glass-card rounded-[2.5rem] flex flex-col">
          <CardHeader className="p-8">
            <CardTitle className="text-2xl font-black text-white">Recent Arena Runs</CardTitle>
            <CardDescription className="text-neutral-400">Your latest practice performance</CardDescription>
          </CardHeader>
          <CardContent className="p-8 pt-0 space-y-6 flex-1">
            {recentAttempts.length === 0 ? (
              <div className="text-center py-12 text-neutral-500">
                <BookOpen className="h-16 w-16 mx-auto mb-4 opacity-10" />
                <p className="font-medium">No exams taken yet.</p>
                <p className="text-sm mt-1">Start a practice session to see your progress here!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentAttempts.map((attempt) => {
                  const percentage = attempt.percentage || Math.round((attempt.score / attempt.total_questions) * 100);
                  let scoreColor = "text-red-400";
                  if (percentage >= 70) scoreColor = "text-emerald-400";
                  else if (percentage >= 50) scoreColor = "text-amber-400";

                  return (
                    <div key={attempt.id} className="flex items-center justify-between border-b border-white/5 pb-4 last:border-0 last:pb-0">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center">
                           <HistoryIcon className="h-5 w-5 text-neutral-500" />
                        </div>
                        <div>
                          <p className="font-bold text-sm text-white capitalize">{attempt.subject} ({attempt.exam_type.toUpperCase()})</p>
                          <p className="text-[10px] text-neutral-500 uppercase tracking-wider font-medium">
                            {new Date(attempt.created_at).toLocaleDateString("en-NG", { month: "short", day: "numeric", year: "numeric" })}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-black text-lg ${scoreColor}`}>{attempt.score}/{attempt.total_questions}</p>
                        <p className="text-[10px] text-neutral-500 font-bold uppercase">{percentage}%</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
          <div className="p-8 pt-0 mt-auto">
              <Link href="/history">
                <Button variant="ghost" className="w-full text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 font-bold transition-all h-12 rounded-xl">
                  Analyze Full History
                </Button>
              </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ title, value, sub, icon, color }: any) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20, scale: 0.95 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }
      }}
    >
      <Card className="glass-card glass-card-hover rounded-[2rem] overflow-hidden group">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 px-8 pt-8">
          <CardTitle className="text-xs font-black uppercase tracking-widest text-neutral-500">{title}</CardTitle>
          <div className="group-hover:scale-125 group-hover:rotate-12 transition-all duration-300">
            {icon}
          </div>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          <div className={`text-4xl font-black tracking-tighter ${color || 'text-white'}`}>{value}</div>
          <p className="text-[11px] text-neutral-500 mt-1 font-medium">{sub}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function FeatureRow({ title, status, desc, color }: any) {
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/[0.07] transition-all group cursor-default">
       <div className="space-y-1">
          <p className="text-sm font-black text-white group-hover:text-indigo-300 transition-colors duration-200">{title}</p>
          <p className="text-[10px] text-neutral-500 leading-tight pr-4">{desc}</p>
       </div>
       <div className={`px-3 py-1 rounded-full bg-black/40 border border-white/5 text-[9px] font-black uppercase tracking-widest shrink-0 ${color} group-hover:scale-105 transition-transform duration-200`}>
          {status}
       </div>
    </div>
  );
}
