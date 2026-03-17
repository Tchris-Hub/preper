import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { 
        exam_type, subject, year, score, 
        total_questions, details, time_spent_seconds 
    } = body;

    // Handle multi-subject array for storage
    const subjectLabel = Array.isArray(subject) ? subject.join(", ") : subject;

    const { data, error } = await supabase
      .from("exam_attempts")
      .insert({
        user_id: user.id,
        exam_type: (exam_type || "UTME").toLowerCase(),
        subject: subjectLabel,
        score: score || 0,
        total_questions: total_questions || 0,
        time_spent_seconds: time_spent_seconds || 0,
        answers: details || {}, // 'details' from frontend maps to 'answers' in DB
        started_at: new Date(Date.now() - (time_spent_seconds || 0) * 1000).toISOString(),
        completed_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error("Submission Error:", error);
      return NextResponse.json({ error: "Failed to save attempt", details: error.message }, { status: 500 });
    }

    return NextResponse.json({ status: "success", attempt_id: data.id });
  } catch (error: any) {
    return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
  }
}
