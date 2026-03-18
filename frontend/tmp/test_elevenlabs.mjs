import axios from "axios";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: ".env.local" });

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

async function testElevenLabs() {
    console.log("Testing ElevenLabs API with key:", ELEVENLABS_API_KEY?.substring(0, 5) + "...");
    
    try {
        const res = await axios.get("https://api.elevenlabs.io/v1/voices", {
            headers: {
                "xi-api-key": ELEVENLABS_API_KEY,
            }
        });
        console.log("Success! Status:", res.status);
        console.log("Found", res.data.voices?.length, "voices.");
    } catch (error) {
        if (error.response) {
            console.error("ElevenLabs API Error Status:", error.response.status);
            console.error("ElevenLabs API Error Data:", JSON.stringify(error.response.data, null, 2));
        } else {
            console.error("Error:", error.message);
        }
    }
}

testElevenLabs();
