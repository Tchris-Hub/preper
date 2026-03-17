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
    const VOICE_ID = voiceId || "cgSgspJ2msm6clMCkdW9"; 

    if (!ELEVENLABS_API_KEY) {
      return NextResponse.json({ error: "TTS Key missing" }, { status: 500 });
    }

    // Advanced Markup Parsing: Convert human-readable tags into model-friendly ones
    const processedText = text
      .replace(/\[slow\]/g, "") // ElevenLabs 2.5 handles speed via settings, but we can wrap in ... for pseudo-slow
      .replace(/\[emphasis\]/g, "") // We let the model infer from text or add subtle punctuation
      .replace(/\[pause\]/g, " ... ");

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}/stream`,
      {
        method: "POST",
        headers: {
          "xi-api-key": ELEVENLABS_API_KEY,
          "Content-Type": "application/json",
          "accept": "audio/mpeg",
        },
        body: JSON.stringify({
          text: processedText,
          model_id: modelId || process.env.ELEVENLABS_MODEL_ID || "eleven_flash_v2_5",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.8,
            style: 0.2, // Higher style for more "Nigerian" expressiveness
            use_speaker_boost: true,
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(error, { status: response.status });
    }

    // Return the response as a stream for partial playback while downloading
    return new NextResponse(response.body, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error) {
    console.error("TTS error:", error);
    return NextResponse.json({ error: "Voice module engine failure" }, { status: 500 });
  }
}
