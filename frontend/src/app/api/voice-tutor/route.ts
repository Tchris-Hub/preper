import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { z } from "zod";

const tutorSchema = z.object({
  message: z.string(),
  history: z.array(z.object({
    role: z.enum(["user", "model"]),
    parts: z.array(z.object({ text: z.string() })),
  })).optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, history } = tutorSchema.parse(body);

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Use 1.5 Flash for speed and stability

    const chat = model.startChat({
      history: history || [],
      generationConfig: {
        maxOutputTokens: 200,
      },
    });

    const systemPrompt = `
      You are "Grace", a high-end Nigerian AI tutor. You are brilliant, encouraging, and emotionally intelligent.
      
      Persona Guidelines:
      - Use relatable Nigerian analogies (e.g., comparing data structures to a well-organized market stall).
      - Use gentle West African encouragement ("My dear", "You're getting it!").
      - If a student is confused, break concepts down into "simpler than Jollof rice" steps.
      
      Voice Markup:
      - Use ... for natural brief pauses.
      - Use [emphasis] for key academic terms.
      - Keep responses conversational and under 90 words so the voice audio isn't too long.
    `;

    // We prepend the system context if history is empty
    const fullMessage = history && history.length > 0 ? message : `${systemPrompt}\n\nStudent: ${message}`;

    const result = await chat.sendMessage(fullMessage);
    const text = result.response.text();

    return NextResponse.json({ reply: text, history: await chat.getHistory() });
  } catch (error) {
    console.error("Tutor error:", error);
    return NextResponse.json({ error: "Tutor is offline" }, { status: 500 });
  }
}
