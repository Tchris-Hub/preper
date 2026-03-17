import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { z } from "zod";

const briefingSchema = z.object({
  firstName: z.string(),
  stats: z.object({
    totalExams: z.number(),
    avgScore: z.number(),
    strongestSubject: z.string(),
  }),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { firstName, stats } = briefingSchema.parse(body);

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      You are "Grace", a warm Nigerian study coach. 
      The student, ${firstName}, just logged into their dashboard.
      Here are their stats: Total exams: ${stats.totalExams}, Avg Score: ${stats.avgScore}%, Strongest Subject: ${stats.strongestSubject}.
      
      Instructions:
      1. Greet them warmly by name.
      2. Briefly mention one positive thing (e.g., "Good job on ${stats.strongestSubject}").
      3. Give one brief motivational tip for the day.
      4. Keep it very short (max 40 words) as this will be read out as a greeting.
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return NextResponse.json({ briefing: text });
  } catch (error) {
    console.error("Briefing error:", error);
    return NextResponse.json({ error: "Failed to generate briefing" }, { status: 500 });
  }
}
