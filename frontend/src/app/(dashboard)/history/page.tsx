"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { format } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Calendar, BookOpen, Target, CheckCircle } from "lucide-react";

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

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Exam History</h1>
        <p className="text-neutral-400">Review your past performance and identify trends.</p>
      </div>

      <Card className="bg-black/40 border-white/10 backdrop-blur-md rounded-2xl">
        <CardHeader>
          <CardTitle>Recent Attempts</CardTitle>
          <CardDescription>All your practice sessions are saved here automatically.</CardDescription>
        </CardHeader>
        <CardContent>
          {attempts.length === 0 ? (
            <div className="text-center py-12 text-neutral-500">
              <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>You haven't taken any exams yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {attempts.map((attempt) => {
                const percentage = Math.round((attempt.score / attempt.total_questions) * 100) || 0;
                let scoreColor = "text-red-400";
                if (percentage >= 70) scoreColor = "text-emerald-400";
                else if (percentage >= 50) scoreColor = "text-amber-400";

                return (
                  <div key={attempt.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors gap-4">
                    <div className="flex items-start gap-4">
                      <div className={`h-12 w-12 rounded-full flex items-center justify-center bg-black/50 border border-white/10 shrink-0`}>
                        <CheckCircle className={`h-6 w-6 ${scoreColor}`} />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-white capitalize">{attempt.subject} ({attempt.exam_type})</h3>
                        <div className="flex items-center gap-3 text-sm text-neutral-400 mt-1">
                          <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {format(new Date(attempt.date_attempted), "MMM d, yyyy h:mm a")}</span>
                          <span className="flex items-center gap-1"><Target className="h-3 w-3" /> Year {attempt.year}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto mt-2 md:mt-0 px-2 md:px-0">
                      <div className="text-left md:text-right">
                        <div className={`text-2xl font-black ${scoreColor}`}>
                          {attempt.score}<span className="text-base text-neutral-500 font-normal">/{attempt.total_questions}</span>
                        </div>
                        <div className="text-xs text-neutral-500 font-medium tracking-wider uppercase">Score</div>
                      </div>
                      <div className="text-right">
                        <div className={`text-xl font-bold ${scoreColor}`}>{percentage}%</div>
                        <div className="text-xs text-neutral-500 font-medium tracking-wider uppercase">Grade</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
