import { createBrowserClient } from "@supabase/ssr";

// .env.local থেকে URL এবং Key নিচ্ছি
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

// Supabase ক্লায়েন্ট তৈরি করছি (নতুন SSR নিয়মে, যা অটোমেটিক Cookie ম্যানেজ করবে)
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
