"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  Sparkles, Target, Zap, AlertTriangle, 
  ArrowRight, ShieldCheck, TrendingUp, 
  RefreshCcw, Loader2, BrainCircuit
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ResponsiveContainer, PieChart, Pie, Cell, 
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid 
} from "recharts";
import { toast } from "sonner";

interface AnalysisResult {
  strengths: string[];
  weaknesses: string[];
  redemption_steps: string[];
  readiness_score: number;
  coach_memo: string;
}

export default function AnalyticsHub() {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);

  const fetchAnalysis = async () => {
    try {
      const res = await fetch("/api/ai/analytics");
      const data = await res.json();
      
      if (!res.ok) {
        toast.error(data.error || "Failed to fetch AI analysis");
        return;
      }
      
      setAnalysis(data);
    } catch (err) {
      toast.error("Network error fetching AI insights");
    } finally {
      setLoading(false);
      setRegenerating(false);
    }
  };

  useEffect(() => {
    fetchAnalysis();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <BrainCircuit className="h-12 w-12 text-indigo-500 animate-pulse" />
        <p className="text-neutral-400 animate-bounce">Consulting Gemini for your academic report...</p>
      </div>
    );
  }

  if (!analysis) return (
    <div className="text-center py-20">
      <p className="text-neutral-400">Could not generate analysis. Try taking an exam first!</p>
    </div>
  );

  const chartData = [
    { name: "Readiness", value: analysis.readiness_score },
    { name: "Gap", value: 100 - analysis.readiness_score }
  ];

  const COLORS = ["#6366f1", "rgba(255,255,255,0.05)"];

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tight text-white flex items-center gap-3">
             <Sparkles className="h-8 w-8 text-indigo-400" />
             AI RESULTS HUB
          </h1>
          <p className="text-neutral-500 max-w-2xl">
            Deep intelligence analysis of your performance across the Arena. Grace has identified exactly where you stand.
          </p>
        </div>
        <div className="flex items-center gap-4">
           <Button 
            onClick={() => { setRegenerating(true); fetchAnalysis(); }} 
            disabled={regenerating}
            variant="outline"
            className="rounded-xl border-white/10 hover:bg-white/5 gap-2 h-12"
          >
            {regenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4" />}
            Regenerate Insights
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Readiness Meter */}
        <Card className="glass-card md:col-span-1 rounded-[2.5rem] p-8 flex flex-col items-center text-center overflow-hidden relative border-indigo-500/20">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />
          <CardTitle className="text-sm font-black uppercase tracking-widest text-neutral-500 mb-6">JAMB READINESS</CardTitle>
          
          <div className="relative h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
               <span className="text-5xl font-black text-white">{analysis.readiness_score}%</span>
               <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Score</span>
            </div>
          </div>

          <p className="text-indigo-200/70 text-sm mt-4 italic leading-relaxed px-4">
            &ldquo;{analysis.coach_memo}&rdquo;
          </p>
          <div className="mt-8 flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wide bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20">
             <TrendingUp className="h-4 w-4" />
             Trending Upward
          </div>
        </Card>

        {/* Strengths & Weaknesses */}
        <div className="lg:col-span-2 grid md:grid-cols-2 gap-8">
           <Card className="glass-card rounded-[2.5rem] p-8 space-y-6 border-indigo-500/10 hover:border-indigo-500/30 transition-all">
              <div className="flex items-center gap-3 text-indigo-400">
                 <Zap className="h-6 w-6" />
                 <h3 className="text-xl font-bold text-white">Your Fortresses</h3>
              </div>
              <div className="space-y-4">
                 {analysis.strengths.map((s, i) => (
                   <motion.div 
                     initial={{ opacity: 0, x: -20 }} 
                     animate={{ opacity: 1, x: 0 }} 
                     transition={{ delay: i * 0.1 }}
                     key={i} 
                     className="flex items-start gap-4 p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10"
                   >
                      <ShieldCheck className="h-5 w-5 text-indigo-500 shrink-0 mt-0.5" />
                      <p className="text-sm text-neutral-300 font-medium">{s}</p>
                   </motion.div>
                 ))}
              </div>
           </Card>

           <Card className="glass-card rounded-[2.5rem] p-8 space-y-6 border-red-500/10 hover:border-red-500/30 transition-all">
              <div className="flex items-center gap-3 text-red-400">
                 <AlertTriangle className="h-6 w-6" />
                 <h3 className="text-xl font-bold text-white">Critical Gaps</h3>
              </div>
              <div className="space-y-4">
                 {analysis.weaknesses.map((w, i) => (
                   <motion.div 
                     initial={{ opacity: 0, x: -20 }} 
                     animate={{ opacity: 1, x: 0 }} 
                     transition={{ delay: i * 0.1 }}
                     key={i} 
                     className="flex items-start gap-4 p-4 rounded-2xl bg-red-500/5 border border-red-500/10"
                   >
                      <Target className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                      <p className="text-sm text-neutral-300 font-medium">{w}</p>
                   </motion.div>
                 ))}
              </div>
           </Card>
        </div>
      </div>

      {/* Redemption Steps */}
      <Card className="glass-card rounded-[2.5rem] p-10 space-y-8 overflow-hidden relative border-white/5">
         <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 blur-[120px] rounded-full -mr-48 -mt-48" />
         <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-12">
            <div className="space-y-4 max-w-sm">
               <h3 className="text-4xl font-black text-white italic tracking-tighter">REDEMPTION ARC</h3>
               <p className="text-neutral-400 leading-relaxed font-medium">
                  Grace has plotted a route to fix your weaknesses. Follow these steps to maximize your point gain.
               </p>
               <div className="flex items-center gap-4 pt-4">
                  <div className="h-1 w-12 bg-indigo-600 rounded-full" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Priority Execution</span>
               </div>
            </div>
            <div className="grid md:grid-cols-3 gap-6 w-full flex-1">
               {analysis.redemption_steps.map((step, i) => (
                 <motion.div 
                   whileHover={{ y: -5, backgroundColor: "rgba(255,255,255,0.04)" }}
                   key={i} 
                   className="p-8 rounded-[2rem] bg-white/5 border border-white/5 space-y-6 group transition-all"
                 >
                    <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-black text-white shadow-lg shadow-indigo-600/20 group-hover:scale-110 group-hover:rotate-3 transition-transform">
                       0{i + 1}
                    </div>
                    <p className="text-sm text-neutral-300 leading-relaxed font-medium min-h-[60px]">{step}</p>
                    <div className="flex items-center gap-2 text-indigo-400 text-[10px] font-black uppercase tracking-widest group-hover:gap-3 transition-all pt-2 border-t border-white/5">
                       Action Protocol <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                 </motion.div>
               ))}
            </div>
         </div>
      </Card>
    </div>
  );
}
