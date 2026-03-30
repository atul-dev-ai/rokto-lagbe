"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Droplet, Mail, Lock, Loader2, AlertTriangle } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 🟢 Rate Limiting States
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  // ইনপুটের ডাটা ধরার স্টেট
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // 🟢 Cooldown Timer Logic
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    } else if (cooldown === 0 && isLocked) {
      setIsLocked(false);
      setAttempts(0); // Cooldown শেষ হলে attempt রিসেট
    }
    return () => clearInterval(timer);
  }, [cooldown, isLocked]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    // ইউজার টাইপ করা শুরু করলে আগের এরর রিমুভ করে দেওয়া ভালো UX
    if (error) setError(null);
  };

  // লগইন হ্যান্ডলার
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // 🟢 Rate Limit Check
    if (isLocked) {
      setError(`Too many attempts. Please try again in ${cooldown} seconds.`);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword(
        {
          email: formData.email,
          password: formData.password,
        },
      );

      if (authError) throw authError;

      if (data.session) {
        router.push("/");
        router.refresh();
      }
    } catch (err: any) {
      // 🟢 Failed attempt logic
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      if (newAttempts >= 5) {
        // 5 বার ভুল করলে লক
        setIsLocked(true);
        setCooldown(60); // 60 সেকেন্ডের জন্য লক
        setError(
          "Too many failed attempts. Your account is temporarily locked for 60 seconds.",
        );
      } else {
        setError(err.message || "Invalid email or password.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 pt-18 relative overflow-hidden bg-[#050505]">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 w-full h-full pointer-events-none -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-900/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-800/10 rounded-full blur-[120px] animate-pulse delay-1000"></div>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-slate-900/60 backdrop-blur-2xl rounded-[2rem] shadow-2xl border border-slate-800 p-8 md:p-10 transform transition-all hover:scale-[1.01]">
        {/* Header */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-800 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-red-600/30 border border-red-500/30">
            <Droplet className="w-8 h-8 fill-red-500/20" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight mb-2">
            Welcome Back!
          </h1>
          <p className="text-slate-400 text-sm font-medium">
            Please enter your details to sign in.
          </p>
        </div>

        {/* Error Message Display (Updated for Rate Limiting) */}
        {error && (
          <div
            className={`mb-6 p-4 rounded-xl border text-sm font-bold flex items-start gap-3 ${isLocked ? "bg-red-950/50 border-red-900 text-red-400" : "bg-amber-950/30 border-amber-900/50 text-amber-500"}`}
          >
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="text-left">
              {error}
              {isLocked && (
                <p className="text-xs text-red-500/70 font-semibold mt-1">
                  Please wait for the timer to finish.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="font-bold text-slate-300 ml-1">
              Email Address
            </Label>
            <div className="relative group">
              <Mail className="absolute left-4 top-3.5 h-5 w-5 text-slate-500 group-focus-within:text-red-500 transition-colors" />
              <Input
                id="email"
                type="email"
                placeholder="hello@example.com"
                value={formData.email}
                onChange={handleChange}
                disabled={isLocked}
                className="pl-12 h-12 rounded-xl bg-slate-950/50 border-slate-800 text-white focus:ring-red-500/20 focus:border-red-500 transition-all font-medium disabled:opacity-50"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between ml-1">
              <Label htmlFor="password" className="font-bold text-slate-300">
                Password
              </Label>
              <Link
                href="#"
                className="text-sm font-bold text-red-500 hover:text-red-400 transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-3.5 h-5 w-5 text-slate-500 group-focus-within:text-red-500 transition-colors" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                disabled={isLocked}
                className="pl-12 h-12 rounded-xl bg-slate-950/50 border-slate-800 text-white focus:ring-red-500/20 focus:border-red-500 transition-all font-medium disabled:opacity-50"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading || isLocked}
            className={`w-full h-12 text-lg font-bold rounded-xl text-white shadow-lg transition-all hover:-translate-y-0.5 disabled:translate-y-0 disabled:cursor-not-allowed ${isLocked ? "bg-slate-800 text-slate-500 shadow-none border border-slate-700" : "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 shadow-red-600/20"}`}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Verifying...
              </>
            ) : isLocked ? (
              `Locked (${cooldown}s)`
            ) : (
              "Sign In"
            )}
          </Button>
        </form>

        {/* Footer Link */}
        <div className="mt-6 text-center text-sm font-medium text-slate-400 pt-6 border-t border-slate-800">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-bold text-red-500 hover:text-red-400 transition-colors"
          >
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}
