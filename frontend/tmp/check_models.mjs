import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import path from "path";

// Load .env.local from the parent directory
dotenv.config({ path: path.resolve(process.cwd(), '../.env.local') });

async function listModels() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY);
    const models = await genAI.listModels();
    console.log("AVAILABLE MODELS:");
    console.log(JSON.stringify(models, null, 2));
  } catch (error) {
    console.error("Failed to list models:", error);
  }
}

listModels();
