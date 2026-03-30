"use client";

import { useState, useEffect } from "react";
import {
  ShieldAlert,
  Heart,
  Wind,
  Users,
  Scale,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase"; // 🟢 Supabase ইমপোর্ট করা হলো

export default function TermsPage() {
  const lastUpdated = "March 30, 2026";
  const [user, setUser] = useState<any>(null);

  // 🟢 ইউজার লগইন করা আছে কিনা তা চেক করা হচ্ছে
  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    checkUser();

    // রিয়েল-টাইম অথ চেঞ্জ লিসেনার
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
      },
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] pt-24 pb-16 relative overflow-hidden">
      {/* SEO Friendly Header */}
      <header className="sr-only">
        <h1>Terms and Conditions - Rokto Lagbe?</h1>
      </header>

      {/* Background Effect */}
      <div className="absolute inset-0 w-full h-full pointer-events-none -z-10">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-900/10 rounded-full blur-[120px] animate-pulse"></div>
      </div>

      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/80 border border-slate-800 text-slate-400 font-bold text-sm mb-6">
            <Scale className="w-4 h-4 text-slate-300" /> Legal Information
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
            Terms & <span className="text-red-600">Conditions</span>
          </h2>
          <p className="text-slate-400 font-medium">
            Last Updated: {lastUpdated}
          </p>
        </div>

        {/* CORE RULE: NON-PROFIT & FREE BLOOD */}
        <div className="bg-red-950/20 border border-red-900/50 p-6 md:p-8 rounded-[2rem] shadow-xl mb-10 animate-in fade-in zoom-in duration-500">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-red-600/20 rounded-xl shrink-0 mt-1">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-red-500 mb-3">
                1. 100% Non-Profit & Free Blood Policy
              </h3>
              <p className="text-slate-300 leading-relaxed font-medium mb-4">
                <strong className="text-white">
                  Rokto Lagbe? is a strictly non-profitable, voluntary emergency
                  network.
                </strong>{" "}
                Buying, selling, or demanding money in exchange for blood is
                illegal, unethical, and strictly prohibited on this platform.
              </p>
              <ul className="space-y-2 text-slate-400 text-sm font-medium">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  Donors must provide blood voluntarily without any financial
                  expectation.
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  If any user is found asking for money, their account will be
                  permanently banned and reported to legal authorities.
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="space-y-8 bg-slate-900/40 backdrop-blur-xl border border-slate-800 p-8 md:p-10 rounded-[2.5rem] shadow-2xl text-slate-300 font-medium leading-relaxed">
          <section>
            <h3 className="text-xl font-black text-white flex items-center gap-3 mb-4 pb-2 border-b border-slate-800">
              <ShieldAlert className="w-6 h-6 text-slate-400" /> 2. General
              Platform Usage
            </h3>
            <p className="mb-3">
              By registering as a finder, donor, volunteer, or oxygen supplier,
              you agree to provide accurate and truthful information. You are
              solely responsible for keeping your profile availability status
              updated.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-black text-white flex items-center gap-3 mb-4 pb-2 border-b border-slate-800">
              <Heart className="w-6 h-6 text-red-500" /> 3. Rules for Blood
              Donors & Seekers
            </h3>
            <ul className="list-disc pl-5 space-y-2 text-slate-400">
              <li>
                <strong className="text-slate-200">Health Eligibility:</strong>{" "}
                Donors must ensure they meet medical criteria before donating.
                The platform does not verify the medical history of donors.
              </li>
              <li>
                <strong className="text-slate-200">Safety First:</strong>{" "}
                Seekers must verify the donor's identity and health condition
                through doctors at the hospital before transfusion.
              </li>
              <li>
                <strong className="text-slate-200">Cooling Period:</strong>{" "}
                Donors must update their dashboard after donating. The system
                will hide their profile for 90 days for safety.
              </li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-black text-white flex items-center gap-3 mb-4 pb-2 border-b border-slate-800">
              <Wind className="w-6 h-6 text-blue-500" /> 4. Rules for Oxygen
              Suppliers
            </h3>
            <ul className="list-disc pl-5 space-y-2 text-slate-400">
              <li>
                Suppliers (both free and commercial) must clearly state their
                terms in the details section.
              </li>
              <li>
                Commercial suppliers must not charge unreasonable or inflated
                prices during emergencies.
              </li>
              <li>
                Availability status ("In Stock" / "Out of Stock") must be kept
                strictly up-to-date to avoid harassing patients during critical
                times.
              </li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-black text-white flex items-center gap-3 mb-4 pb-2 border-b border-slate-800">
              <Users className="w-6 h-6 text-emerald-500" /> 5. Rules for
              Volunteers
            </h3>
            <p className="mb-3">
              Volunteers act as a bridge between patients and resources. They
              must act with empathy, urgency, and without discrimination.
              Volunteers are not allowed to collect funds or donations on behalf
              of "Rokto Lagbe?" without official authorization.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-black text-white flex items-center gap-3 mb-4 pb-2 border-b border-slate-800">
              <Scale className="w-6 h-6 text-slate-400" /> 6. Disclaimer of
              Liability
            </h3>
            <p className="mb-3">
              "Rokto Lagbe?" is merely a technological bridge connecting people
              in need with those who can help. We do not guarantee the quality,
              safety, or medical suitability of the blood or oxygen provided.
              The platform and its developers are not legally liable for any
              medical complications, delays, or disputes between users.
            </p>
          </section>
        </div>

        {/* 🟢 Conditional Action Buttons */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/privacy">
            <button className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold bg-transparent border-2 border-slate-700 hover:border-slate-500 text-slate-300 transition-all cursor-pointer">
              Read Privacy Policy
            </button>
          </Link>

          {user ? (
            <Link href="/">
              <button className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/20 transition-all cursor-pointer flex items-center justify-center gap-2">
                I Understand, Back to Home <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
          ) : (
            <Link href="/signup">
              <button className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20 transition-all cursor-pointer">
                I Understand, Create Account
              </button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
