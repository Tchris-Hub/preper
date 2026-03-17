import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import axios from "axios";

const ALOC_TOKEN = process.env.ALOC_TOKEN;
const ALOC_BASE_URL = "https://questions.aloc.com.ng/api/v2/q";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const subjectsStr = searchParams.get("subjects") || "english";
  const type = searchParams.get("type") || "utme";
  const year = searchParams.get("year") || "2020";
  const mode = searchParams.get("mode") || "normal";

  const subjects = subjectsStr.split(",");
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check subscription (Optional: limit Free users to fewer questions/attempts)
  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_tier")
    .eq("id", user.id)
    .single();

  const isPremium = profile?.subscription_tier !== 'free';

  if (!ALOC_TOKEN) {
    return NextResponse.json({ error: "ALOC Token missing in server config" }, { status: 500 });
  }

  const headers = {
    "AccessToken": ALOC_TOKEN,
    "Accept": "application/json"
  };

  try {
    let allQuestions: any[] = [];

    // Determine questions per subject
    // JAMB Marathon: 4 subjects * 45 questions = 180 total
    // Others: 1 subject * 40 questions (fetched in two batches of 20)
    const questionsPerSubject = mode === 'marathon' ? 45 : 40;
    
    for (const sub of subjects) {
        let subQuestions: any[] = [];
        // ALOC API returns 20 max per call. Fetch until we have enough.
        const target = questionsPerSubject;
        let fetched = 0;
        
        while (fetched < target) {
            const countToFetch = Math.min(20, target - fetched);
            const res = await axios.get(`${ALOC_BASE_URL}/${countToFetch}`, {
                params: { subject: sub, type, year },
                headers,
                timeout: 10000
            });

            if (res.status === 200 && res.data.data) {
                const batch = (Array.isArray(res.data.data) ? res.data.data : [res.data.data])
                    .map((q: any) => ({ ...q, subject: sub })); // Tag question with subject
                subQuestions = [...subQuestions, ...batch];
                fetched += batch.length;
                
                // If we got fewer than requested, the bank might be dry
                if (batch.length < countToFetch) break;
            } else {
                break;
            }
        }
        
        // Mode specific filtering (Simple logic: take only the ones needed)
        let processedQuestions = subQuestions;
        
        if (mode === 'boss') {
            // Boss logic: pretend we filtered for difficulty, in reality just randomized slice
            processedQuestions = processedQuestions.sort(() => 0.5 - Math.random()).slice(0, 20);
        } else if (mode === 'sprint') {
            processedQuestions = processedQuestions.slice(0, 15);
        } else {
            processedQuestions = processedQuestions.slice(0, questionsPerSubject);
        }

        allQuestions = [...allQuestions, ...processedQuestions];
    }

    if (allQuestions.length === 0) {
        return NextResponse.json({ error: "No questions found for the selected combination." }, { status: 404 });
    }

    // Shuffle final set if multiple subjects (Marathon)
    if (subjects.length > 1) {
        allQuestions = allQuestions.sort(() => 0.5 - Math.random());
    }

    return NextResponse.json({ status: 200, data: allQuestions });
  } catch (error: any) {
    console.error("ALOC API Error:", error.response?.data || error.message);
    return NextResponse.json({ 
        error: "Failed to fetch questions from provider", 
        details: error.message 
    }, { status: 502 });
  }
}
