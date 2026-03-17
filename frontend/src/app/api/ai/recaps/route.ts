import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { logAIUsage } from "@/lib/ai-utils";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Quota: 2 recaps per day (Expensive)
  const { data: canUse } = await supabase.rpc("check_ai_quota", {
    user_id_input: user.id,
    feature: "elevenlabs_tts",
    daily_limit: 2
  });

  if (!canUse) return NextResponse.json({ error: "Daily audio limit reached." }, { status: 429 });

  // Get data to summarize (e.g., from the 'notes' table)
  const { data: notes } = await supabase
    .from("notes")
    .select("content, subject")
    .order("created_at", { ascending: false })
    .limit(5);

  if (!notes || notes.length === 0) {
    return NextResponse.json({ error: "No study notes found to summarize. Save some notes first!" }, { status: 400 });
  }

  try {
    // 1. Generate Script with Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const scriptPrompt = `
      Summarize the following study notes into a short (100-word), conversational, and encouraging spoken script. 
      Notes: ${JSON.stringify(notes)}
      
      Tone: Like a friendly Nigerian study partner. Use words like "sharp", "correct", "oya".
      Return strictly JSON:
      { "title": "...", "script": "..." }
    `;
    const scriptResult = await model.generateContent(scriptPrompt);
    const scriptData = JSON.parse(scriptResult.response.text().match(/\{[\s\S]*\}/)![0]);

    // 2. Generate Audio with ElevenLabs
    const ttsRes = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/cgSgspJ2msm6clMCkdW9`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': process.env.ELEVENLABS_API_KEY!
      },
      body: JSON.stringify({
        text: scriptData.script,
        model_id: "eleven_multilingual_v2",
        voice_settings: { stability: 0.5, similarity_boost: 0.75 }
      })
    });

    if (!ttsRes.ok) throw new Error("ElevenLabs failed");
    const audioBlob = await ttsRes.blob();
    const fileName = `${user.id}/${Date.now()}.mp3`;

    // 3. Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("audio-recaps")
      .upload(fileName, audioBlob, { contentType: "audio/mpeg" });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage.from("audio-recaps").getPublicUrl(fileName);

    // 4. Save to DB
    const { data: record } = await supabase.from("audio_recaps").insert({
      user_id: user.id,
      title: scriptData.title,
      summary: scriptData.script,
      audio_url: publicUrl
    }).select().single();

    // Log Usage
    await logAIUsage("elevenlabs_tts");

    return NextResponse.json(record);
  } catch (error) {
    console.error("Audio Recap Error:", error);
    return NextResponse.json({ error: "Failed to generate audio recap." }, { status: 500 });
  }
}

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data } = await supabase
    .from("audio_recaps")
    .select("*")
    .order("created_at", { ascending: false });

  return NextResponse.json(data || []);
}
