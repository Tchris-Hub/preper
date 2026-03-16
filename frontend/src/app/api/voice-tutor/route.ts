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
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" }); // Pro for better reasoning

    const chat = model.startChat({
      history: history || [],
      generationConfig: {
        maxOutputTokens: 200,
      },
    });

    const systemPrompt = `
      You are "Grace", a high-end AI tutor for Nigerian students. 
      You are supportive, smart, and use very clear explanations.
      If the user is confused about a topic (like Chemistry or Maths), break it down step-by-step.
      Use Nigerian context. 
      Keep your responses conversational and under 100 words.
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
