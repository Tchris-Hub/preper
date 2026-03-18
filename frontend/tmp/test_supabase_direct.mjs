
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env.local') });

async function testSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  console.log('Testing Supabase Connectivity...');
  console.log('URL:', url);
  console.log('Key (first 10 chars):', key ? key.substring(0, 10) + '...' : 'MISSING');

  if (!url || !key) {
    console.error('ERROR: Missing environment variables.');
    return;
  }

  try {
    console.log('Attempting fetch to:', `${url}/auth/v1/health`);
    const start = Date.now();
    const res = await fetch(`${url}/auth/v1/health`, {
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`
      }
    });
    const duration = Date.now() - start;
    
    console.log('Status:', res.status);
    console.log('Status Text:', res.statusText);
    console.log('Duration:', duration, 'ms');
    
    const data = await res.json();
    console.log('Response:', data);
  } catch (err) {
    console.error('FETCH FAILED:', err);
  }
}

testSupabase();
