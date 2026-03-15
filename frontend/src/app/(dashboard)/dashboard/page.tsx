"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, BookOpen, UserCircle, PlayCircle, Activity, History as HistoryIcon } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const { user } = useAuthStore();

  const isFree = user?.subscription_tier === 'FREE';
  const mocksLeft = isFree ? Math.max(0, 5 - (user?.daily_mocks_used || 0)) : 'Unlimited';

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.first_name || user?.username}!</h1>
          <p className="text-neutral-400 mt-1">Here is an overview of your progress.</p>
        </div>
        <Link href="/setup">
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg rounded-xl">
            <PlayCircle className="mr-2 h-4 w-4" /> Start New Exam
          </Button>
        </Link>
      </div>

      {isFree && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border border-indigo-500/20 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 bg-gradient-to-b from-indigo-500 to-purple-500 h-full"></div>
          <div>
            <h3 className="font-semibold text-lg text-indigo-50">Free Tier Active</h3>
            <p className="text-sm text-indigo-200 mt-1">
              You have {mocksLeft} free mocks remaining today. Upgrade to unlock unlimited access and advanced analytics.
            </p>
          </div>
          <Link href="/pricing">
            <Button variant="outline" className="border-indigo-500/50 hover:bg-indigo-500/20 text-indigo-100 rounded-xl whitespace-nowrap">
              Upgrade Now
            </Button>
          </Link>
        </motion.div>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-black/40 border-white/10 backdrop-blur-md rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-neutral-300">Total Exams Taken</CardTitle>
            <Activity className="h-4 w-4 text-indigo-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">12</div>
            <p className="text-xs text-neutral-500 mt-1">+2 this week</p>
          </CardContent>
        </Card>
        <Card className="bg-black/40 border-white/10 backdrop-blur-md rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-neutral-300">Average Score</CardTitle>
            <Clock className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">68%</div>
            <p className="text-xs text-neutral-500 mt-1">Across all subjects</p>
          </CardContent>
        </Card>
        <Card className="bg-black/40 border-white/10 backdrop-blur-md rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-neutral-300">Strongest Subject</CardTitle>
            <BookOpen className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">Physics</div>
            <p className="text-xs text-neutral-500 mt-1">82% average</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-black/40 border-white/10 backdrop-blur-md rounded-2xl">
          <CardHeader>
            <CardTitle className="text-white">Quick Actions</CardTitle>
            <CardDescription className="text-neutral-400">Navigate to common tasks</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <Link href="/setup">
              <div className="flex flex-col items-center justify-center p-6 bg-white/5 hover:bg-indigo-500/10 border border-white/5 hover:border-indigo-500/30 transition-all rounded-xl cursor-pointer group gap-3">
                <PlayCircle className="h-8 w-8 text-neutral-400 group-hover:text-indigo-400 transition-colors" />
                <span className="font-medium text-sm text-neutral-300 group-hover:text-white">Practice CBT</span>
              </div>
            </Link>
            <Link href="/history">
              <div className="flex flex-col items-center justify-center p-6 bg-white/5 hover:bg-emerald-500/10 border border-white/5 hover:border-emerald-500/30 transition-all rounded-xl cursor-pointer group gap-3">
                <HistoryIcon className="h-8 w-8 text-neutral-400 group-hover:text-emerald-400 transition-colors" />
                <span className="font-medium text-sm text-neutral-300 group-hover:text-white">Review History</span>
              </div>
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-white/10 backdrop-blur-md rounded-2xl">
          <CardHeader>
            <CardTitle className="text-white">Recent Attempts</CardTitle>
            <CardDescription className="text-neutral-400">Your latest practice sessions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between border-b border-white/5 pb-4 last:border-0 last:pb-0">
                  <div>
                    <p className="font-medium text-sm text-white">Mathematics (UTME)</p>
                    <p className="text-xs text-neutral-500">2 days ago</p>
                  </div>
                  <div className="font-bold text-emerald-400">
                    28/40
                  </div>
                </div>
              ))}
            </div>
            <div className="w-full mt-2 flex justify-center">
              <Link href="/history" className="text-indigo-400 hover:text-indigo-300 text-sm font-medium hover:underline">
                View all history
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
