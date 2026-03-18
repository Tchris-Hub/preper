import axios from "axios";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: ".env.local" });

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const TARGET_VOICE_ID = "cgSgspJ2msm6clMCkdW9";

async function testElevenLabs() {
    console.log("Checking voice ID:", TARGET_VOICE_ID);
    
    try {
        const res = await axios.get(`https://api.elevenlabs.io/v1/voices/${TARGET_VOICE_ID}`, {
            headers: {
                "xi-api-key": ELEVENLABS_API_KEY,
            }
        });
        console.log("Success! Voice found:", res.data.name);
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
