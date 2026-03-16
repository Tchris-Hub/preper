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
import { Loader2, Zap } from "lucide-react";
import { motion } from "framer-motion";

const EXAM_TYPES = ["UTME", "WAEC", "NECO", "POST-UTME"];
const SUBJECTS = ["english", "mathematics", "physics", "chemistry", "biology", "economics", "government", "literature", "commerce", "accounting", "crk", "irk", "geography", "civiceducation"];
const YEARS = ["2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023"];

export default function ExamSetupPage() {
  const [examType, setExamType] = useState("UTME");
  const [subject, setSubject] = useState("english");
  const [year, setYear] = useState("2020");
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const startQuiz = useQuizStore(state => state.startQuiz);

  const handleStart = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/exams/questions/?subject=${subject}&type=${examType.toLowerCase()}&year=${year}`);
      
      const questionData = res.data.data;
      if (!questionData || questionData.length === 0) {
        toast.error("No questions found for this combination. Try another year.");
        setLoading(false);
        return;
      }

      startQuiz(examType, subject, year, questionData, questionData.length * 60);
      toast.success("Exam loaded successfully! Good luck.");
      router.push("/exam");
    } catch (err: any) {
      if (err.response?.status === 403) {
        toast.error("Daily limit reached! Please upgrade to continue practicing.");
        router.push("/settings");
      } else {
        toast.error("Failed to fetch questions. " + (err.response?.data?.error || ""));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Exam Setup</h1>
        <p className="text-neutral-400">Configure your CBT practice session.</p>
      </div>

      <Card className="bg-black/40 border-white/10 backdrop-blur-xl rounded-2xl overflow-hidden shadow-2xl">
        <div className="h-2 w-full bg-gradient-to-r from-indigo-500 to-purple-500" />
        <CardHeader>
          <CardTitle className="text-white">Configuration</CardTitle>
          <CardDescription className="text-neutral-400">Select the parameters for your mock exam.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          
          <div className="space-y-4">
            <Label className="text-base text-neutral-200">Exam Type</Label>
            <div className="flex flex-wrap gap-3">
              {EXAM_TYPES.map(type => (
                <button
                  key={type}
                  onClick={() => setExamType(type)}
                  className={`px-6 py-2 rounded-full border transition-all duration-300 font-medium ${
                    examType === type 
                      ? 'bg-indigo-600 border-indigo-500 text-white shadow-[0_0_15px_rgba(79,70,229,0.5)]' 
                      : 'bg-white/5 border-white/10 text-neutral-300 hover:bg-white/10'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label className="text-neutral-200">Subject</Label>
              <Select value={subject} onValueChange={(val) => setSubject(val || "english")}>
                <SelectTrigger className="bg-black/40 border-white/10 h-12 text-white capitalize focus:ring-indigo-500 rounded-xl">
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent className="bg-neutral-900 border-white/10 text-white max-h-60">
                  {SUBJECTS.map(subj => (
                    <SelectItem key={subj} value={subj} className="capitalize hover:bg-white/5 focus:bg-white/5 rounded-lg cursor-pointer">
                      {subj.replace('civiceducation', 'Civic Education')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-3">
              <Label className="text-neutral-200">Year Focus</Label>
              <Select value={year} onValueChange={(val) => setYear(val || "2020")}>
                <SelectTrigger className="bg-black/40 border-white/10 h-12 text-white focus:ring-indigo-500 rounded-xl">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent className="bg-neutral-900 border-white/10 text-white max-h-60">
                  {YEARS.map(yr => (
                    <SelectItem key={yr} value={yr} className="hover:bg-white/5 focus:bg-white/5 rounded-lg cursor-pointer">
                      {yr}
                    </SelectItem>
                  ))}
                  <SelectItem value="random" className="hover:bg-white/5 focus:bg-white/5 rounded-lg cursor-pointer">Randomized</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-6 border-t border-white/5 bg-black/20">
          <Button 
            onClick={handleStart} 
            disabled={loading}
            className="w-full md:w-auto ml-auto bg-indigo-600 hover:bg-indigo-700 text-white h-12 px-8 rounded-xl shadow-[0_0_20px_rgba(79,70,229,0.3)] transition-transform hover:scale-105 active:scale-95"
          >
            {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Zap className="mr-2 h-5 w-5" />}
            {loading ? "Preparing Exam..." : "Start Practice Session"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
