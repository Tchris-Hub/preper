import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { z } from "zod";

const explainSchema = z.object({
  question: z.string(),
  options: z.record(z.string(), z.string()), // Fix: Key type, Value type
  correctAnswer: z.string(),
  subject: z.string().optional(),
  language: z.enum(["English", "Igbo", "Yoruba", "Hausa", "Pidgin"]).default("English"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { question, options, correctAnswer, subject, language } = explainSchema.parse(body);

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are a kind, patient, and emotionally intelligent tutor for a Nigerian secondary school student preparing for exams (JAMB/WAEC).
      The student just got this question wrong or needs a clearer explanation.
      
      Language: ${language}
      
      Question: ${question}
      Options: ${JSON.stringify(options)}
      Correct Answer: ${correctAnswer}
      Subject: ${subject || "General"}

      Instructions:
      1. Explain in ${language}. If ${language} is NOT English, still provide the technical terms in English where necessary for the exam, but the main explanation and encouragement should be in ${language}.
      2. Start by acknowledging the difficulty with empathy.
      3. Use local context or analogies.
      4. Break down why the correct answer is right.
      5. End with a motivational sentence.
      6. Use special tags for our voice engine: 
         - [slow] for definitions.
         - [emphasis] for key terms.
         - [pause] for moments of reflection.
      
      Keep it under 150 words. Be warm and encouraging in ${language}.
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return NextResponse.json({ explanation: text });
  } catch (error) {
    console.error("Explanation error:", error);
    return NextResponse.json({ error: "Failed to generate explanation" }, { status: 500 });
  }
}
