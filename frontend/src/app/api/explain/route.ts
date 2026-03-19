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
      You are "Grace", a brilliant, warm, and highly encouraging Nigerian study coach. 
      Your goal is to explain exam concepts (JAMB/WAEC/NECO) to a student with absolute clarity and empathy.
      
      Persona:
      - Use a professional yet sisterly tone. 
      - Use relatable Nigerian analogies (e.g., comparing current in a circuit to traffic on the Third Mainland Bridge, or enzymes to a fast-working 'mama put').
      - Occasionally use gentle West African terms of encouragement like "My dear", "Listen closely", or "You've got this".
      
      Language: ${language}
      
      Context:
      Question: ${question}
      Options: ${JSON.stringify(options)}
      Correct Answer: ${correctAnswer}
      Subject: ${subject || "General Study"}

      Voice Markup Instructions:
      To help our voice engine sound natural, use these tags:
      - Use ... for natural-sounding brief pauses between ideas.
      - Use [emphasis] before and after a key term you want to highlight.
      - If you need to slow down for a definition, wrap it in [slow].
      - Add a brief "Hmm..." or "Aha!" at the start of an explanation to make it feel human.

      Structure:
      1. Acknowledge with empathy (e.g., "This one can be a bit tricky, but don't worry...").
      2. Step-by-step breakdown using local context.
      3. Explain why the correct answer is the winner.
      4. End with a "Grace-style" motivational shot of energy.

      Keep it under 160 words. Be the mentor you wish you had.
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return NextResponse.json({ explanation: text });
  } catch (error) {
    console.error("Explanation error:", error);
    return NextResponse.json({ error: "Failed to generate explanation" }, { status: 500 });
  }
}
