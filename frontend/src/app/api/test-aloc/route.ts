import { NextResponse } from "next/server";
import axios from "axios";

export async function GET() {
  const ALOC_TOKEN = process.env.ALOC_TOKEN;
  const ALOC_BASE_URL = "https://questions.aloc.com.ng/api/v2/q";

  if (!ALOC_TOKEN) {
    return NextResponse.json({ 
      error: "ALOC_TOKEN is missing from environment variables.",
      tip: "Ensure you've added ALOC_TOKEN to your Vercel project settings and redeployed."
    }, { status: 500 });
  }

  // Basic info about the token (censored)
  const tokenPreview = ALOC_TOKEN.substring(0, 4) + "..." + ALOC_TOKEN.substring(ALOC_TOKEN.length - 4);
  const tokenLength = ALOC_TOKEN.length;
  const hasWhitespace = ALOC_TOKEN.trim() !== ALOC_TOKEN;

  try {
    const res = await axios.get(`${ALOC_BASE_URL}/1`, {
      params: { subject: "english", type: "utme", year: "2020" },
      headers: {
        "AccessToken": ALOC_TOKEN.trim(), // Use trim() just in case
        "Accept": "application/json"
      },
      timeout: 15000
    });

    return NextResponse.json({
      status: "success",
      message: "Direct connectivity test passed",
      token_info: {
        length: tokenLength,
        preview: tokenPreview,
        has_whitespace: hasWhitespace
      },
      aloc_response: res.data
    });
  } catch (error: any) {
    return NextResponse.json({
      status: "failed",
      error: error.message,
      token_info: {
        length: tokenLength,
        preview: tokenPreview,
        has_whitespace: hasWhitespace
      },
      aloc_data: error.response?.data || "No data from ALOC",
      aloc_status: error.response?.status
    }, { status: 502 });
  }
}
