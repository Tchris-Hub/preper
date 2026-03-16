import { NextResponse } from "next/server";
import { z } from "zod";

const ttsSchema = z.object({
  text: z.string(),
  voiceId: z.string().optional(),
  modelId: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { text, voiceId, modelId } = ttsSchema.parse(body);

    const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
    // Grace or Liam - clear voices
    const VOICE_ID = voiceId || "cgSgspJ2msm6clMCkdW9"; 

    if (!ELEVENLABS_API_KEY) {
      return NextResponse.json({ error: "TTS Key missing" }, { status: 500 });
    }

    const processedText = text
      .replace(/\[pause\]/g, " ... ")
      .replace(/\[slow\]/g, "")
      .replace(/\[emphasis\]/g, "");

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      {
        method: "POST",
        headers: {
          "xi-api-key": ELEVENLABS_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: processedText,
          model_id: modelId || "eleven_flash_v2_5", // Use flash by default for speed
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.0,
            use_speaker_boost: true,
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(error, { status: response.status });
    }

    const audioBuffer = await response.arrayBuffer();
    
    return new NextResponse(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
      },
    });
  } catch (error) {
    console.error("TTS error:", error);
    return NextResponse.json({ error: "Failed to generate voice" }, { status: 500 });
  }
}
