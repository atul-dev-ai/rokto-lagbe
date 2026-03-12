"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Droplet, Mail, Lock, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ইনপুটের ডাটা ধরার স্টেট
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // লগইন হ্যান্ডলার
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Supabase Auth দিয়ে লগইন চেক করা
      const { data, error: authError } = await supabase.auth.signInWithPassword(
        {
          email: formData.email,
          password: formData.password,
        },
      );

      if (authError) throw authError;

      // লগইন সফল হলে হোমপেজে বা ড্যাশবোর্ডে পাঠানো
      if (data.session) {
        router.push("/"); // আপাতত হোমপেজে পাঠাচ্ছি
        router.refresh(); // ন্যাভবার আপডেট করার জন্য রিফ্রেশ
      }
    } catch (err: any) {
      setError(err.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 w-full h-full pointer-events-none -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px] animate-pulse delay-1000"></div>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-background/80 backdrop-blur-2xl rounded-[2rem] shadow-2xl border border-border p-8 md:p-10 transform transition-all hover:scale-[1.01]">
        {/* Header */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-red-500/30">
            <Droplet className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black text-foreground tracking-tight mb-2">
            Welcome Back!
          </h1>
          <p className="text-muted-foreground text-sm font-medium">
            Please enter your details to sign in.
          </p>
        </div>

        {/* Error Message Display */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm font-medium text-center">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="font-bold ml-1">
              Email Address
            </Label>
            <div className="relative group">
              <Mail className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground group-focus-within:text-red-500 transition-colors" />
              <Input
                id="email"
                type="email"
                placeholder="hello@example.com"
                value={formData.email}
                onChange={handleChange}
                className="pl-12 h-12 rounded-xl bg-muted/50 border-border focus:ring-red-500/20 focus:border-red-500 transition-all font-medium"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between ml-1">
              <Label htmlFor="password" className="font-bold">
                Password
              </Label>
              <Link
                href="#"
                className="text-sm font-bold text-red-600 hover:text-red-700 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground group-focus-within:text-red-500 transition-colors" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="pl-12 h-12 rounded-xl bg-muted/50 border-border focus:ring-red-500/20 focus:border-red-500 transition-all font-medium"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 text-lg font-bold rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg shadow-red-600/20 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>

        {/* Footer Link */}
        <div className="mt-8 text-center text-sm font-medium text-muted-foreground pt-6 border-t border-border/50">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-bold text-red-600 hover:text-red-700 hover:underline"
          >
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}
