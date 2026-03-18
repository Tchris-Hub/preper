import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const ALOC_TOKEN = process.env.ALOC_TOKEN;
console.log("Token:", ALOC_TOKEN);
if (ALOC_TOKEN) {
    console.log("Hex:", Buffer.from(ALOC_TOKEN).toString("hex"));
    console.log("Length:", ALOC_TOKEN.length);
}
