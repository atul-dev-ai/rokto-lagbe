"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Droplet,
  HeartPulse,
  Search,
  Activity,
} from "lucide-react";
import { DonorFinder } from "@/components/DonorFinder";
import { OxygenSection } from "@/components/OxygenSection";
import { VolunteersSection } from "@/components/VolunteersSection";
import { Footer } from "@/components/FooterSection";
// import { VolunteersSection } from "@/components/VolunteersSection"; // 🟢 এটা আমরা নেক্সটে বানাবো!

export default function HomePage() {
  // স্মুথ স্ক্রল ফাংশন
  const scrollToSearch = () => {
    document
      .getElementById("search-section")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* ================= HERO SECTION (ROKTO LAGBE) ================= */}
      <div className="relative min-h-[100vh] py-18 overflow-hidden flex flex-col items-center justify-center selection:bg-red-500/30 pb-20 bg-[#050505]">
        {/* Background Layers */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#1a0505_0%,_#050505_100%)]"></div>
        <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[600px] md:w-[800px] h-[600px] bg-[conic-gradient(from_90deg_at_50%_50%,#000000_0deg,#dc2626_180deg,#000000_360deg)] opacity-20 blur-[120px] animate-pulse"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150px] md:w-[250px] h-full bg-gradient-to-b from-red-600/20 via-rose-600/5 to-transparent blur-[60px]"></div>

        <div className="absolute inset-0 opacity-50 mix-blend-screen pointer-events-none">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-15"></div>
          <div className="absolute -inset-[100%] bg-gradient-to-tr from-transparent via-red-900/10 to-transparent blur-3xl animate-[spin_60s_linear_infinite]"></div>
          <div className="absolute -inset-[100%] bg-gradient-to-bl from-transparent via-rose-900/10 to-transparent blur-3xl animate-[spin_90s_linear_infinite_reverse]"></div>
        </div>

        {/* Falling Blood Droplets */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-red-500/50 blur-[1px]"
              style={{
                width: Math.random() * 4 + 2 + "px",
                height: Math.random() * 6 + 4 + "px",
                top: Math.random() * 100 + "%",
                left: Math.random() * 100 + "%",
                animation: `float-droplet ${Math.random() * 8 + 8}s linear infinite`,
                opacity: Math.random() * 0.6 + 0.2,
                borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
              }}
            ></div>
          ))}
        </div>

        {/* Background Heartbeat */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10 pointer-events-none z-0">
          <HeartPulse className="w-[400px] h-[400px] md:w-[600px] md:h-[600px] text-red-600 animate-[heartbeat_2s_ease-in-out_infinite]" />
        </div>

        {/* Main Content */}
        <div className="relative z-30 flex flex-col items-center text-center px-4 mt-10">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-red-950/40 border border-red-500/30 text-red-400 font-semibold text-sm mb-8 shadow-[0_0_20px_rgba(220,38,38,0.2)] backdrop-blur-md fade-in slide-in-from-bottom-4 duration-1000 animate-bounce">
            <Activity className="w-4 h-4 text-red-500 animate-[heartbeat_1s_ease-in-out_infinite] " />
            <span className="tracking-widest uppercase text-xs font-bold">
              Smart Emergency Network
            </span>
          </div>

          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-red-100 to-red-500 drop-shadow-[0_0_30px_rgba(220,38,38,0.4)]">
              রক্ত লাগবে?
            </span>
          </h1>

          <p className="text-xl md:text-3xl text-red-100/70 font-medium mb-12 max-w-3xl drop-shadow-md animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300 leading-relaxed">
            এক ফোঁটা রক্ত, বাঁচুক একটি প্রাণ। <br className="hidden md:block" />
            <span className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] font-bold">
              আপনার আশেপাশের ভেরিফাইড ডোনারদের খুঁজে বের করুন এখনই।
            </span>
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-6 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500 w-full sm:w-auto">
            <Button
              className="group cursor-pointer relative w-full sm:w-auto h-16 md:h-20 px-10 md:px-12 text-lg md:text-xl font-bold rounded-full bg-gradient-to-b from-red-500 to-red-800 hover:from-red-600 hover:to-red-900 text-white border-b-4 border-red-950 shadow-[0_0_40px_rgba(220,38,38,0.4)] hover:shadow-[0_0_60px_rgba(220,38,38,0.7)] transition-all duration-300 hover:-translate-y-2 overflow-hidden"
              onClick={scrollToSearch}
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
              <span className="relative flex items-center gap-3">
                <Search className="w-6 h-6" />
                ডোনার খুঁজুন
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </span>
            </Button>

            <Button
              asChild
              variant="outline"
              className="group relative w-full sm:w-auto h-16 md:h-20 px-10 md:px-12 text-lg md:text-xl font-bold rounded-full bg-transparent border-2 border-red-500/50 hover:bg-red-950/30 text-red-100 hover:text-white backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:border-red-400 hover:shadow-[0_0_30px_rgba(220,38,38,0.2)]"
            >
              <Link href="/signup">
                <span className="relative flex items-center gap-3">
                  <Droplet className="w-6 h-6 text-red-500 group-hover:fill-red-500 transition-all" />
                  ডোনার হোন
                </span>
              </Link>
            </Button>
          </div>
        </div>

        <style
          dangerouslySetInnerHTML={{
            __html: `
          @keyframes float-droplet {
            0% { transform: translateY(0) scale(1); opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { transform: translateY(100vh) scale(0.5); opacity: 0; }
          }
          @keyframes shimmer {
            100% { transform: translateX(100%); }
          }
          @keyframes heartbeat {
            0%, 100% { transform: scale(1); }
            15% { transform: scale(1.05); }
            30% { transform: scale(1); }
            45% { transform: scale(1.05); }
            60% { transform: scale(1); }
          }
        `,
          }}
        />
      </div>

      {/* ================= COMPONENTS (SEARCH, OXYGEN, VOLUNTEERS) ================= */}

      {/* 🟢 ১. ব্লাড ডোনার সেকশন */}
      <DonorFinder />

      {/* 🟢 ২. অক্সিজেন সেকশন */}
      <OxygenSection />

      {/* 🟢 ৩. ভলান্টিয়ার্স সেকশন (আপাতত ফাঁকা, নেক্সটে বানাবো) */}
      <VolunteersSection />

      <Footer />
    </div>
  );
}
