import { createClient } from "@supabase/supabase-js";

// .env.local থেকে URL এবং Key নিচ্ছি
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

// Supabase ক্লায়েন্ট তৈরি করছি
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
