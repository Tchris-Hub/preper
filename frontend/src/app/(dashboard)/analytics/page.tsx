"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip as RechartsTooltip, XAxis, YAxis, PieChart, Pie, Cell } from "recharts";

interface SubjectStat {
  subject: string;
  avg_score: number;
  count: number;
}

const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#f43f5e', '#f97316', '#eab308', '#22c55e', '#14b8a6'];

export default function AnalyticsPage() {
  const [stats, setStats] = useState<SubjectStat[]>([]);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [loading, setLoading] = useState(true);

  // Mock trend data since backend only returns basic avg currently
  const mockTrendData = [
    { name: 'Mon', score: 40 },
    { name: 'Tue', score: 45 },
    { name: 'Wed', score: 52 },
    { name: 'Thu', score: 48 },
    { name: 'Fri', score: 60 },
    { name: 'Sat', score: 65 },
    { name: 'Sun', score: 72 },
  ];

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get("/exams/analytics/");
        setStats(res.data.subject_stats);
        setTotalAttempts(res.data.total_attempts);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  const pieData = stats.map(s => ({
    name: s.subject,
    value: s.count
  }));

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-neutral-400">Deep dive into your performance metrics.</p>
      </div>

      {totalAttempts === 0 ? (
         <Card className="bg-black/40 border-white/10 backdrop-blur-md">
           <CardContent className="py-12 text-center text-neutral-400">
             Not enough data. Complete a few exams to unlock analytics.
           </CardContent>
         </Card>
      ) : (
        <>
          <div className="grid md:grid-cols-2 gap-6 relative">
            
            <Card className="bg-black/40 border-white/10 backdrop-blur-md rounded-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl" />
              <CardHeader>
                <CardTitle>Performance Trend</CardTitle>
                <CardDescription>Your estimated score trajectory over time</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mockTrendData}>
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" stroke="#525252" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#525252" fontSize={12} tickLine={false} axisLine={false} />
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: '#171717', borderColor: '#262626', borderRadius: '8px', color: '#fff' }}
                      itemStyle={{ color: '#818cf8' }}
                    />
                    <Area type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-black/40 border-white/10 backdrop-blur-md rounded-2xl relative overflow-hidden">
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl" />
              <CardHeader>
                <CardTitle>Subject Distribution</CardTitle>
                <CardDescription>Breakdown of exams by subject</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: '#171717', borderColor: '#262626', borderRadius: '8px', color: '#fff', textTransform: 'capitalize' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

          </div>

          <Card className="bg-black/40 border-white/10 backdrop-blur-md rounded-2xl">
            <CardHeader>
              <CardTitle>Subject Mastery</CardTitle>
              <CardDescription>Average scores across all subjects</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.map((stat, i) => (
                  <div key={stat.subject} className="flex items-center justify-between group">
                    <div className="w-full">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-white capitalize">{stat.subject}</span>
                        <span className="text-sm text-neutral-400">{Math.round(stat.avg_score)} avg points</span>
                      </div>
                      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-1000 ease-out"
                          style={{ 
                            width: `${Math.min(100, Math.max(5, (stat.avg_score / 40) * 100))}%`,
                            backgroundColor: COLORS[i % COLORS.length]
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
