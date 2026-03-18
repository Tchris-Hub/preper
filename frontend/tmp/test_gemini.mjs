import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const API_KEY = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

async function testGemini() {
    console.log("Testing Gemini API with key:", API_KEY?.substring(0, 5) + "...");
    
    if (!API_KEY) {
        console.error("No API key found!");
        return;
    }

    try {
        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        
        const prompt = "Say 'Gemini is working!'";
        const result = await model.generateContent(prompt);
        const response = await result.response;
        console.log("Success! Response:", response.text());
    } catch (error) {
        console.error("Gemini API Error:", error.message);
    }
}

testGemini();
