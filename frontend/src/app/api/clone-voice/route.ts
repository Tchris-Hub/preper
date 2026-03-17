import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const name = formData.get("name") as string;

    if (!file || !name) {
      return NextResponse.json({ error: "File and name are required" }, { status: 400 });
    }

    // Safety: Limit file size to 10MB to prevent massive uploads
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large (max 10MB)" }, { status: 400 });
    }

    const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

    if (!ELEVENLABS_API_KEY) {
      return NextResponse.json({ error: "TTS Key missing" }, { status: 500 });
    }

    // ElevenLabs requires multipart/form-data for voice cloning
    const externalFormData = new FormData();
    externalFormData.append("name", name);
    externalFormData.append("files", file);
    externalFormData.append("description", `Personal cloned tutor voice for ${name}. Created via Ace Your Exams.`);

    const response = await fetch("https://api.elevenlabs.io/v1/voices/add", {
      method: "POST",
      headers: {
        "xi-api-key": ELEVENLABS_API_KEY,
      },
      body: externalFormData,
    });

    if (!response.ok) {
        const error = await response.json();
        const errorMessage = error.detail?.message || error.message || "Cloning failed";
        return NextResponse.json({ error: errorMessage }, { status: response.status });
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Cloning error:", error);
    return NextResponse.json({ error: "Internal server error during cloning" }, { status: 500 });
  }
}
