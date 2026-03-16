"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useQuizStore } from "@/store/useQuizStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Loader2, ArrowLeft, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import api from "@/lib/axios";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { ExplanationVoice } from "@/components/ExplanationVoice";
import { QuestionVoice } from "@/components/QuestionVoice";

export default function ExamPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [reviewScore, setReviewScore] = useState(0);

  const { 
    questions, currentQuestionIndex, answers, timeRemaining, 
    examType, subject, year, isDraft, tick, setAnswer, 
    nextQuestion, prevQuestion, goToQuestion, clearQuiz 
  } = useQuizStore();

  useEffect(() => {
    setMounted(true);
    if (!isDraft || questions.length === 0) {
      router.push("/dashboard");
    }
  }, [isDraft, questions, router]);

  useEffect(() => {
    if (!mounted || !isDraft || timeRemaining <= 0) return;
    
    const timer = setInterval(() => {
      tick();
      if (useQuizStore.getState().timeRemaining <= 0) {
        clearInterval(timer);
        toast.error("Time is up! Auto-submitting...");
        handleSubmit();
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, [mounted, isDraft, tick]);

  const handleSubmit = useCallback(async () => {
    setSubmitting(true);
    try {
      // Calculate score simply based on matching answer keys
      let score = 0;
      const details: Record<string, any> = {};
      
      questions.forEach((q, i) => {
        const userAnswer = (answers[i] || "").toLowerCase();
        const correctAnswer = (q.answer || "").toLowerCase();
        const isCorrect = userAnswer === correctAnswer;
        
        if (isCorrect) score++;
        
        details[q.id] = {
          userAnswer,
          correctAnswer,
          isCorrect
        };
      });

      await api.post("/exams/submit/", {
        exam_type: examType,
        subject,
        year,
        score,
        total_questions: questions.length,
        details
      });

      toast.success("Exam submitted successfully!");
      setReviewScore(score);
      setShowConfirm(false);
      setIsSubmitted(true);
      // do not clearQuiz or route away so they can review
      
    } catch (error) {
      toast.error("Failed to submit exam.");
      setSubmitting(false);
      setShowConfirm(false);
    }
  }, [questions, answers, examType, subject, year, clearQuiz, router]);

  if (!mounted || !isDraft) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-white">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const currentQ = questions[currentQuestionIndex];
  if (!currentQ && !isSubmitted) return null;

  const answeredCount = Object.keys(answers).length;

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex flex-col font-sans p-4 lg:p-8 overflow-y-auto w-full">
        <div className="max-w-4xl mx-auto space-y-8 w-full">
          <Card className="bg-black/40 border-white/10 backdrop-blur-md rounded-2xl overflow-hidden shadow-2xl">
            <div className="h-2 w-full bg-gradient-to-r from-emerald-500 to-indigo-500" />
            <CardContent className="p-8 text-center space-y-4">
              <CheckCircle2 className="h-16 w-16 text-emerald-500 mx-auto" />
              <h1 className="text-3xl font-bold">Exam Completed</h1>
              <p className="text-neutral-400 text-lg">You scored <span className="text-emerald-400 font-bold">{reviewScore}</span> out of {questions.length}</p>
              <Button onClick={() => { clearQuiz(); router.push("/history"); }} className="mt-4 bg-indigo-600">Back to Dashboard</Button>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Review Your Answers</h2>
            {questions.map((q, i) => {
              const userAnswer = answers[i] || null;
              const isCorrect = userAnswer === q.answer;
              return (
                <Card key={i} className={`bg-black/40 border-white/10 backdrop-blur-md overflow-hidden ${isCorrect ? 'border-emerald-500/50' : 'border-red-500/50'}`}>
                  <CardContent className="p-6 space-y-4">
                    <div className="flex gap-4">
                      <span className="text-2xl font-bold text-neutral-500">{i + 1}.</span>
                      <div className="space-y-2 w-full">
                        <p className="text-lg leading-relaxed text-neutral-200" dangerouslySetInnerHTML={{ __html: q.question }} />
                        
                        <div className="mt-4 grid gap-2">
                          {['a', 'b', 'c', 'd'].map(key => {
                            const opt = q.option[key as keyof typeof q.option];
                            if (!opt) return null;
                            const isUserChoice = userAnswer === key;
                            const isActualAnswer = q.answer === key;
                            let bg = "bg-neutral-900 border-white/5";
                            if (isActualAnswer) bg = "bg-emerald-500/20 border-emerald-500 text-emerald-200";
                            else if (isUserChoice && !isCorrect) bg = "bg-red-500/20 border-red-500 text-red-200";

                            return (
                              <div key={key} className={`p-3 rounded border ${bg} flex items-center gap-3`}>
                                <span className="uppercase font-bold text-neutral-500">{key}</span>
                                <span dangerouslySetInnerHTML={{ __html: opt }} />
                              </div>
                            );
                          })}
                        </div>
                        
                        {q.solution && (
                          <div className="mt-6 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
                            <h4 className="font-bold text-indigo-400 mb-2">Explanation</h4>
                            <p className="text-neutral-300 mb-3" dangerouslySetInnerHTML={{ __html: q.solution }} />
                            <ExplanationVoice question={q} />
                          </div>
                        )}
                        {!q.solution && (
                          <div className="mt-6 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-lg flex flex-col gap-4">
                            <h4 className="font-bold text-indigo-400 mb-0">AI Tutor Coach</h4>
                            <ExplanationVoice question={q} />
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col font-sans">
      {/* Top Bar */}
      <header className="h-16 border-b border-white/10 bg-black/40 backdrop-blur-md sticky top-0 z-10 flex items-center justify-between px-4 lg:px-8">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-bold uppercase tracking-wider text-indigo-400 text-sm">
                {examType} • {subject}
              </span>
              <div className="px-2 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-[8px] font-black text-indigo-300 uppercase tracking-widest">
                {useQuizStore.getState().mode.replace('_', ' ')}
              </div>
            </div>
            <span className="text-xs text-neutral-400">
              Question {currentQuestionIndex + 1} of {questions.length} • {year === "random" ? "Random Year" : year} Edition
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className={`text-2xl font-mono font-bold tracking-wider ${timeRemaining < 300 ? 'text-red-500 animate-pulse' : 'text-emerald-400'}`}>
              {formatTime(timeRemaining)}
            </div>
            <div className="text-[10px] uppercase tracking-widest text-neutral-500 font-semibold">Time Remaining</div>
          </div>
          <Button 
            onClick={() => setShowConfirm(true)} 
            variant="destructive" 
            className="hidden md:flex rounded-xl font-semibold shadow-[0_0_15px_rgba(239,68,68,0.3)] hover:shadow-[0_0_20px_rgba(239,68,68,0.5)] transition-all"
          >
            Submit Exam
          </Button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col md:flex-row max-w-7xl mx-auto w-full gap-6 p-4 lg:p-8">
        
        {/* Question Area */}
        <div className="flex-1 space-y-6">
          <Card className="bg-black/40 border-white/10 backdrop-blur-md rounded-2xl overflow-hidden min-h-[400px] flex flex-col">
            <CardContent className="p-6 md:p-10 flex-1 flex flex-col relative overflow-hidden">
              
              {/* Question Text */}
              <AnimatePresence mode="wait">
                <motion.div 
                  key={currentQuestionIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-8 flex-1"
                >
                  <div className="flex gap-4">
                    <span className="text-5xl font-bold text-indigo-500/20 shrink-0 mt-[-10px]">
                      {(currentQuestionIndex + 1).toString().padStart(2, '0')}
                    </span>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between mb-2">
                        {currentQ.section && (
                          <p className="text-sm font-medium text-emerald-400 uppercase tracking-widest leading-relaxed bg-emerald-500/10 inline-block px-3 py-1 rounded-md">
                            {currentQ.section.replace(/<[^>]+>/g, '')}
                          </p>
                        )}
                        <QuestionVoice 
                          question={currentQ.question} 
                          options={currentQ.option} 
                        />
                      </div>
                      <h2 
                        className="text-xl md:text-2xl leading-relaxed text-neutral-100" 
                        dangerouslySetInnerHTML={{ __html: currentQ.question }} 
                      />
                      {currentQ.image && (
                        <img src={currentQ.image} alt="Question figure" className="max-w-full h-auto rounded-lg border border-white/10" />
                      )}
                    </div>
                  </div>

                  <div className="grid gap-3 pl-0 md:pl-16">
                    {['a', 'b', 'c', 'd'].map((key) => {
                      const optionText = currentQ.option[key as keyof typeof currentQ.option];
                      if (!optionText) return null;
                      
                      const isSelected = answers[currentQuestionIndex] === key;
                      
                      return (
                        <button
                          key={key}
                          onClick={() => setAnswer(currentQuestionIndex, key)}
                          className={`flex items-center gap-4 w-full p-4 rounded-xl border text-left transition-all duration-200 group ${
                            isSelected 
                              ? 'bg-indigo-600/20 border-indigo-500 shadow-[0_0_15px_rgba(79,70,229,0.2)]' 
                              : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                          }`}
                        >
                          <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                            isSelected ? 'bg-indigo-500 text-white' : 'bg-neutral-800 text-neutral-400 group-hover:bg-neutral-700'
                          }`}>
                            {key.toUpperCase()}
                          </div>
                          <span 
                            className={`flex-1 ${isSelected ? 'text-indigo-100' : 'text-neutral-300'}`}
                            dangerouslySetInnerHTML={{ __html: optionText }} 
                          />
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              </AnimatePresence>
              
            </CardContent>
            
            {/* Bottom Nav */}
            <div className="bg-black/60 border-t border-white/10 p-4 flex items-center justify-between">
              <Button 
                variant="outline" 
                onClick={prevQuestion} 
                disabled={currentQuestionIndex === 0}
                className="bg-transparent border-white/10 text-white hover:bg-white/10 rounded-xl px-6"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Previous
              </Button>
              
              <Button 
                onClick={nextQuestion} 
                disabled={currentQuestionIndex === questions.length - 1}
                className="bg-white text-black hover:bg-neutral-200 rounded-xl px-8 shadow-lg shadow-white/10"
              >
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </Card>
          
          <Button 
            onClick={() => setShowConfirm(true)} 
            variant="destructive" 
            className="w-full md:hidden rounded-xl h-14 text-lg font-bold shadow-[0_0_15px_rgba(239,68,68,0.3)]"
          >
            Submit Exam
          </Button>
        </div>

        {/* Navigation Panel */}
        <div className="w-full md:w-80 space-y-6 shrink-0 order-first md:order-last">
          <Card className="bg-black/40 border-white/10 backdrop-blur-md rounded-2xl h-full flex flex-col max-h-[140px] md:max-h-none">
            <CardContent className="p-4 flex flex-col h-full space-y-4">
              <div className="flex justify-between items-center px-1">
                <span className="text-sm font-medium text-neutral-400">Question Map</span>
                <span className="text-sm font-bold text-indigo-400">{answeredCount}/{questions.length} Answered</span>
              </div>
              
              <div className="overflow-y-auto flex-1 pr-2 custom-scrollbar">
                <div className="grid grid-cols-5 gap-2">
                  {questions.map((_, i) => {
                    const isAnswered = !!answers[i];
                    const isCurrent = i === currentQuestionIndex;
                    
                    return (
                      <button
                        key={i}
                        onClick={() => goToQuestion(i)}
                        className={`h-10 rounded-lg flex items-center justify-center text-sm font-bold transition-all ${
                          isCurrent
                            ? 'ring-2 ring-indigo-500 ring-offset-2 ring-offset-black bg-indigo-600/20 text-indigo-300 border border-indigo-500'
                            : isAnswered
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 hover:bg-emerald-500/30'
                              : 'bg-white/5 text-neutral-400 border border-white/5 hover:bg-white/10'
                        }`}
                      >
                        {i + 1}
                      </button>
                    )
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Submit Confirmation Dialog */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-neutral-900 border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-4 text-emerald-400 mb-4">
              <AlertCircle className="h-8 w-8 text-amber-500" />
              <h2 className="text-xl font-bold text-white">Submit Exam?</h2>
            </div>
            
            <p className="text-neutral-300 mb-6">
              You have answered <span className="font-bold text-indigo-400">{answeredCount}</span> out of <span className="font-bold">{questions.length}</span> questions. 
              Are you sure you want to absolute submit? You cannot undo this action.
            </p>
            
            <div className="flex justify-end gap-3">
              <Button 
                variant="outline" 
                onClick={() => setShowConfirm(false)}
                disabled={submitting}
                className="bg-transparent border-white/10 text-white hover:bg-white/10 transition-colors"
              >
                Keep Reviewing
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleSubmit} 
                disabled={submitting}
                className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-[0_0_15px_rgba(79,70,229,0.3)]"
              >
                {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
                Yes, Submit Now
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
