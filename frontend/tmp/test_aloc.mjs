import axios from "axios";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: ".env.local" });

const ALOC_TOKEN = process.env.ALOC_TOKEN;
const ALOC_BASE_URL = "https://questions.aloc.com.ng/api/v2/q";

async function testALOC() {
    console.log("Testing ALOC API with token:", ALOC_TOKEN);
    const headers = {
        "AccessToken": ALOC_TOKEN,
        "Accept": "application/json"
    };

    try {
        const res = await axios.get(`${ALOC_BASE_URL}/1`, {
            params: { subject: "english", type: "utme" },
            headers,
            timeout: 10000
        });
        console.log("Success! Status:", res.status);
        console.log("Data:", JSON.stringify(res.data, null, 2));
    } catch (error) {
        if (error.response) {
            console.error("ALOC API Error Status:", error.response.status);
            console.error("ALOC API Error Data:", error.response.data);
        } else {
            console.error("Error:", error.message);
        }
    }
}

testALOC();
