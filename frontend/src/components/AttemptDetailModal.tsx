"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, XCircle, HelpCircle, Headphones } from "lucide-react";
import api from "@/lib/axios";
import { ExplanationVoice } from "@/components/ExplanationVoice";
import { motion, AnimatePresence } from "framer-motion";

interface QuestionDetail {
  question: string;
  option: Record<string, string>;
  section?: string;
  image?: string;
  answer: string;
  solution: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
}

interface AttemptDetail {
  id: number;
  subject: string;
  exam_type: string;
  year: string;
  score: number;
  total_questions: number;
  details: Record<string, QuestionDetail>;
}

export function AttemptDetailModal({ 
  attemptId, 
  isOpen, 
  onClose 
}: { 
  attemptId: number | null, 
  isOpen: boolean, 
  onClose: () => void 
}) {
  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState<AttemptDetail | null>(null);

  useEffect(() => {
    if (isOpen && attemptId) {
      const fetchDetail = async () => {
        setLoading(true);
        try {
          const res = await api.get(`/exams/history/${attemptId}/`);
          setDetail(res.data);
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchDetail();
    }
  }, [isOpen, attemptId]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-neutral-950 border-white/10 text-white custom-scrollbar">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black italic uppercase tracking-tighter">
            Arena Review: {detail?.subject} {detail?.year}
          </DialogTitle>
          <DialogDescription className="text-neutral-500">
            Reviewing Attempt #{attemptId} • Score: {detail?.score}/{detail?.total_questions}
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-4">
             <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
             <p className="text-sm text-neutral-500 animate-pulse">Retrieving historical data...</p>
          </div>
        ) : detail ? (
          <div className="space-y-8 mt-6">
            {Object.values(detail.details).map((q, idx) => (
              <Card key={idx} className="bg-white/5 border-white/5 rounded-2xl overflow-hidden p-6 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                     <span className="text-3xl font-black text-indigo-500/20">{idx + 1}</span>
                     <div>
                        {q.section && (
                          <div className="text-[10px] font-black uppercase tracking-widest text-emerald-500/60 mb-1" dangerouslySetInnerHTML={{ __html: q.section }} />
                        )}
                        <h4 className="text-lg font-medium leading-relaxed" dangerouslySetInnerHTML={{ __html: q.question }} />
                     </div>
                  </div>
                  {q.isCorrect ? (
                    <CheckCircle2 className="h-6 w-6 text-emerald-500 shrink-0" />
                  ) : (
                    <XCircle className="h-6 w-6 text-red-500 shrink-0" />
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-3 mt-4">
                  {Object.entries(q.option).map(([key, value]) => {
                    const isUserAnswer = q.userAnswer === key.toLowerCase();
                    const isCorrectAnswer = q.correctAnswer === key.toLowerCase();
                    
                    return (
                      <div 
                        key={key}
                        className={`p-3 rounded-xl border flex items-center gap-3 transition-all ${
                          isCorrectAnswer 
                            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" 
                            : isUserAnswer 
                              ? "bg-red-500/10 border-red-500/30 text-red-400" 
                              : "bg-black/20 border-white/5 text-neutral-400"
                        }`}
                      >
                         <span className="w-6 h-6 rounded-lg bg-black/40 flex items-center justify-center font-bold uppercase text-[10px]">
                            {key}
                         </span>
                         <span className="text-sm font-medium">{value}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 space-y-4 pt-6 border-t border-white/5">
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-indigo-400 font-bold uppercase text-xs">
                         <HelpCircle className="h-4 w-4" />
                         Grace's Coaching
                      </div>
                      <div className="text-[10px] text-neutral-500 font-black tracking-widest uppercase italic">Premium Insights</div>
                   </div>
                   
                   <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-xl p-6">
                      <p className="text-sm text-neutral-300 italic mb-6 leading-relaxed">
                         "Let's look at this mistake. {q.isCorrect ? "You got it right! But do you know WHY?" : "Don't worry, many students trip up here. Here's the key concept..."}"
                      </p>
                      
                      {/* ElevenLabs Integration: Re-using ExplanationVoice */}
                      <div className="flex justify-end">
                         <ExplanationVoice question={{
                            question: q.question,
                            option: q.option,
                            answer: q.answer,
                            solution: q.solution
                         } as any} />
                      </div>
                   </div>
                   
                   {q.solution && (
                     <div className="mt-4 p-4 bg-white/5 rounded-xl border border-white/10">
                        <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">Step-by-Step Solution</p>
                        <div className="text-sm text-neutral-400 leading-relaxed" dangerouslySetInnerHTML={{ __html: q.solution }} />
                     </div>
                   )}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center text-neutral-500">
             Failed to load attempt details.
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Card({ children, className, ...props }: any) {
  return <div className={className} {...props}>{children}</div>;
}
