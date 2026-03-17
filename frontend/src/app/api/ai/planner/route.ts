import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { logAIUsage } from "@/lib/ai-utils";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check quota (Limit: 3 plan regenerations per day)
  const { data: canUse } = await supabase.rpc("check_ai_quota", {
    user_id_input: user.id,
    feature: "study_plan",
    daily_limit: 3
  });

  if (!canUse) {
    return NextResponse.json({ error: "You've reached your daily AI planning limit." }, { status: 429 });
  }

  // Fetch recent performance to inform the plan
  const { data: attempts } = await supabase
    .from("exam_attempts")
    .select("subject, score, total_questions")
    .order("created_at", { ascending: false })
    .limit(20);

  const { examType, targetDate } = await req.json();

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `
      Create a highly structured 7-day study plan for a student preparing for the ${examType} exam.
      Target Date: ${targetDate}
      Recent Performance: ${JSON.stringify(attempts)}
      
      Requirements:
      1. Focus more time on subjects with lower scores in the performance data.
      2. Each day must have a "Focus Subject", 2 "Tasks", and a "Goal".
      3. Use a Nigerian academic tone (mention JAMB/WAEC specific themes).
      
      Return strictly valid JSON:
      {
        "plan_title": "...",
        "days": [
          {
            "day_number": 1,
            "subject": "Mathematics",
            "tasks": ["...", "..."],
            "goal": "Master Calculus basics"
          },
          ... up to day 7
        ]
      }
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const planData = JSON.parse(jsonMatch ? jsonMatch[0] : text);

    // Persist to database
    await supabase.from("study_plans").insert({
      user_id: user.id,
      title: planData.plan_title,
      content: planData.days
    });

    // Log Usage
    await logAIUsage("study_plan");

    return NextResponse.json(planData);
  } catch (error) {
    console.error("Planner Error:", error);
    return NextResponse.json({ error: "Failed to generate your master plan." }, { status: 500 });
  }
}

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: plan } = await supabase
    .from("study_plans")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  return NextResponse.json(plan || { error: "No plan found" });
}
