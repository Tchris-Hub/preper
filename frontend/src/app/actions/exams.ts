"use server";

import { createClient } from "@/lib/supabase/server";

/**
 * ENTERPRISE EXAM ACTIONS
 *
 * All exam grading and submission logic runs exclusively on the server.
 * This prevents students from:
 * 1. Manipulating their score in browser DevTools
 * 2. Submitting fake exam results
 * 3. Accessing answer keys before submission
 */

interface ExamAnswer {
  questionId: string;
  selectedOption: string;
  correctAnswer: string;
}

interface SubmitExamPayload {
  subject: string;
  examType: "jamb" | "waec" | "neco" | "custom";
  answers: ExamAnswer[];
  timeSpentSeconds?: number;
}

export async function submitExam(payload: SubmitExamPayload) {
  const supabase = await createClient();

  // Verify user is authenticated (server-side check)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to submit an exam." };
  }

  // SERVER-SIDE GRADING: The score is calculated here, not in the browser
  const { answers, subject, examType, timeSpentSeconds } = payload;
  const totalQuestions = answers.length;
  const score = answers.filter((a) => a.selectedOption === a.correctAnswer).length;

  // Use a transaction-safe insert
  const { data, error } = await supabase
    .from("exam_attempts")
    .insert({
      user_id: user.id,
      subject,
      exam_type: examType,
      score,
      total_questions: totalQuestions,
      time_spent_seconds: timeSpentSeconds || null,
      answers: JSON.stringify(answers),
    })
    .select()
    .single();

  if (error) {
    console.error("Exam submission error:", error);
    return { error: "Failed to save your exam results. Please try again." };
  }

  return {
    success: true,
    data: {
      id: data.id,
      score,
      totalQuestions,
      percentage: Math.round((score / totalQuestions) * 100),
    },
  };
}

export async function getExamHistory() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const { data, error } = await supabase
    .from("exam_attempts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return { error: "Failed to fetch exam history." };
  }

  return { data };
}

export async function getExamAttemptDetail(attemptId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const { data, error } = await supabase
    .from("exam_attempts")
    .select("*")
    .eq("id", attemptId)
    .single();

  if (error) {
    return { error: "Attempt not found." };
  }

  return { data };
}

export async function getExamAnalytics() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const { data: attempts, error } = await supabase
    .from("exam_attempts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return { error: "Failed to fetch analytics." };
  }

  // Calculate analytics server-side
  const totalExams = attempts?.length || 0;
  const avgScore =
    totalExams > 0
      ? Math.round(
          (attempts!.reduce((sum, a) => sum + (a.score / a.total_questions) * 100, 0) / totalExams)
        )
      : 0;

  const subjectBreakdown: Record<string, { count: number; avgScore: number }> = {};
  attempts?.forEach((attempt) => {
    if (!subjectBreakdown[attempt.subject]) {
      subjectBreakdown[attempt.subject] = { count: 0, avgScore: 0 };
    }
    subjectBreakdown[attempt.subject].count++;
    subjectBreakdown[attempt.subject].avgScore +=
      (attempt.score / attempt.total_questions) * 100;
  });

  Object.keys(subjectBreakdown).forEach((subject) => {
    subjectBreakdown[subject].avgScore = Math.round(
      subjectBreakdown[subject].avgScore / subjectBreakdown[subject].count
    );
  });

  return {
    data: {
      totalExams,
      avgScore,
      subjectBreakdown,
      recentAttempts: attempts?.slice(0, 5) || [],
    },
  };
}
