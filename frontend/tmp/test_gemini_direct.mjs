import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config({ path: ".env.local" });

const API_KEY = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

async function testGeminiDirect() {
    console.log("Direct Fetch Test with key:", API_KEY?.substring(0, 5) + "...");
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;
    
    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: "Explain quantum physics in one sentence." }] }]
            })
        });
        
        const data = await res.json();
        console.log("Status:", res.status);
        console.log("Response:", JSON.stringify(data, null, 2));
    } catch (error) {
        console.error("Fetch Error:", error.message);
    }
}

testGeminiDirect();
