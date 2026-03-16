import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const name = formData.get("name") as string;

    const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

    if (!ELEVENLABS_API_KEY) {
      return NextResponse.json({ error: "TTS Key missing" }, { status: 500 });
    }

    // ElevenLabs requires multipart/form-data for voice cloning
    const externalFormData = new FormData();
    externalFormData.append("name", name);
    externalFormData.append("files", file);
    externalFormData.append("description", "Personal cloned tutor voice for Ace Your Exams student.");

    const response = await fetch("https://api.elevenlabs.io/v1/voices/add", {
      method: "POST",
      headers: {
        "xi-api-key": ELEVENLABS_API_KEY,
      },
      body: externalFormData,
    });

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Cloning error:", error);
    return NextResponse.json({ error: "Failed to clone voice" }, { status: 500 });
  }
}
