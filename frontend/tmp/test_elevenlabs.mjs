import fetch from 'node-fetch';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: '.env.local' });

async function testElevenLabs() {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  console.log(`Testing API Key: ${apiKey?.substring(0, 5)}...${apiKey?.substring(apiKey.length - 5)}`);

  if (!apiKey) {
    console.error("No ELEVENLABS_API_KEY found in .env.local");
    return;
  }

  try {
    const response = await fetch("https://api.elevenlabs.io/v1/user", {
      method: "GET",
      headers: {
        "xi-api-key": apiKey,
        "accept": "application/json",
      },
    });

    const data = await response.json();
    console.log(`Status: ${response.status}`);
    console.log(`Response: ${JSON.stringify(data, null, 2)}`);

    if (response.ok) {
      console.log("✅ ElevenLabs Key is valid!");
    } else {
      console.log("❌ ElevenLabs Key rejected.");
    }
  } catch (error) {
    console.error("Network error:", error);
  }
}

testElevenLabs();
