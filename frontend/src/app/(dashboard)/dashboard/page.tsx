"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, BookOpen, UserCircle, PlayCircle, Activity, History as HistoryIcon, Sparkles } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { DashboardVoice } from "@/components/DashboardVoice";
import { VoiceTutor } from "@/components/VoiceTutor";

export default function DashboardPage() {
  const { user } = useAuthStore();

  const isFree = user?.subscription_tier === 'FREE';
  const mocksLeft = isFree ? Math.max(0, 5 - (user?.daily_mocks_used || 0)) : 'Unlimited';

  return (
    <div className="space-y-8 pb-20">
      <DashboardVoice />
      
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white">Welcome, {user?.first_name || user?.username}!</h1>
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
              You have {mocksLeft} free mocks left today. Upgrade to <b>Ace Unlimited</b> to unlock the AI Tutor and Voice Coaching.
            </p>
          </div>
          <Link href="/subscription">
            <Button className="bg-white text-indigo-950 hover:bg-indigo-50 font-black rounded-xl px-8 h-12 whitespace-nowrap shadow-xl">
              Get Unlimited Access
            </Button>
          </Link>
        </motion.div>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        <StatCard title="Total Exams" value="12" sub="+2 this week" icon={<Activity className="h-4 w-4 text-indigo-400" />} />
        <StatCard title="Average Score" value="68%" sub="Across all subjects" icon={<Clock className="h-4 w-4 text-emerald-400" />} />
        <StatCard title="Strongest Subject" value="Physics" sub="82% average" color="text-purple-400" icon={<BookOpen className="h-4 w-4 text-purple-400" />} />
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Capability Showcase */}
        <Card className="bg-black/40 border-white/10 backdrop-blur-md rounded-[2.5rem] overflow-hidden flex flex-col">
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

        {/* Recent Activity */}
        <Card className="bg-black/40 border-white/10 backdrop-blur-md rounded-[2.5rem] flex flex-col">
          <CardHeader className="p-8">
            <CardTitle className="text-2xl font-black text-white">Recent Arena Runs</CardTitle>
            <CardDescription className="text-neutral-400">Your latest practice performance</CardDescription>
          </CardHeader>
          <CardContent className="p-8 pt-0 space-y-6 flex-1">
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between border-b border-white/5 pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center">
                       <HistoryIcon className="h-5 w-5 text-neutral-500" />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-white">Mathematics (UTME)</p>
                      <p className="text-[10px] text-neutral-500 uppercase tracking-wider font-medium">March 16 • Year 2020</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-lg text-emerald-400">28/40</p>
                    <p className="text-[10px] text-neutral-500 font-bold uppercase">70% Grade</p>
                  </div>
                </div>
              ))}
            </div>
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
    <Card className="bg-black/40 border-white/10 backdrop-blur-md rounded-[2rem] overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 px-8 pt-8">
        <CardTitle className="text-xs font-black uppercase tracking-widest text-neutral-500">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent className="px-8 pb-8">
        <div className={`text-4xl font-black tracking-tighter ${color || 'text-white'}`}>{value}</div>
        <p className="text-[11px] text-neutral-500 mt-1 font-medium">{sub}</p>
      </CardContent>
    </Card>
  );
}

function FeatureRow({ title, status, desc, color }: any) {
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all group">
       <div className="space-y-1">
          <p className="text-sm font-black text-white group-hover:text-indigo-300 transition-colors">{title}</p>
          <p className="text-[10px] text-neutral-500 leading-tight pr-4">{desc}</p>
       </div>
       <div className={`px-3 py-1 rounded-full bg-black/40 border border-white/5 text-[9px] font-black uppercase tracking-widest shrink-0 ${color}`}>
          {status}
       </div>
    </div>
  );
}
