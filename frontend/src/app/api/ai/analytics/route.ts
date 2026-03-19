import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { logAIUsage } from "@/lib/ai-utils";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check quota (Limit: 5 analyses per day)
  const { data: canUse } = await supabase.rpc("check_ai_quota", {
    user_id_input: user.id,
    feature: "gemini_analysis",
    daily_limit: 5
  });

  if (!canUse) {
    return NextResponse.json({ error: "Daily AI limit reached. Come back tomorrow!" }, { status: 429 });
  }

  // Fetch all user exam history
  const { data: attempts } = await supabase
    .from("exam_attempts")
    .select("subject, score, total_questions, created_at")
    .order("created_at", { ascending: false });

  if (!attempts || attempts.length === 0) {
    return NextResponse.json({ error: "No exam history found. Take some tests first!" }, { status: 400 });
  }

  // Analyze with Gemini
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `
      As an expert academic tutor, analyze the following exam history for a student.
      History: ${JSON.stringify(attempts)}
      
      Tasks:
      1. Identify the top 3 strengths.
      2. Identify the top 3 specific weaknesses (be specific about subjects).
      3. Provide 3 actionable "Redemption" steps to improve.
      4. Rate their current "JAMB Readiness" from 0-100%.
      
      Return the response in strictly valid JSON format with this structure:
      {
        "strengths": ["...", "...", "..."],
        "weaknesses": ["...", "...", "..."],
        "redemption_steps": ["...", "...", "..."],
        "readiness_score": 85,
        "coach_memo": "A short encouraging note from Grace (the AI Tutor)."
      }
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    // Extract JSON (Gemini sometimes adds markdown blocks)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const analysis = JSON.parse(jsonMatch ? jsonMatch[0] : text);

    // Log Usage
    await logAIUsage("gemini_analysis");

    return NextResponse.json(analysis);
  } catch (error) {
    console.error("Gemini Error:", error);
    return NextResponse.json({ error: "AI Engine failed to process results." }, { status: 500 });
  }
}
