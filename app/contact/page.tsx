"use client";

import { useState, useEffect } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Send,
  Loader2,
  CheckCircle2,
  X,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  }>({
    show: false,
    message: "",
    type: "success",
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  // 🟢 Custom Toast Notification Auto-Hide Logic
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast({ ...toast, show: false });
      }, 5000); // ৫ সেকেন্ড পর টোস্ট গায়েব হয়ে যাবে
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // এখানে আপনি চাইলে Supabase-এর contact messages টেবিলে ডাটা পাঠাতে পারেন
      // আপাতত আমরা ২ সেকেন্ডের একটি ফেক ডিলে (Delay) দিচ্ছি প্রফেশনাল ফিলের জন্য
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // 🟢 Default alert এর বদলে Custom Toast!
      setToast({
        show: true,
        message:
          "Thank you! Your message has been sent successfully. We will get back to you soon.",
        type: "success",
      });

      // ফর্ম রিসেট
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      setToast({
        show: true,
        message: "Something went wrong. Please try again later.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] pt-24 pb-12 relative overflow-hidden">
      {/* 🟢 SEO Friendly Header (H1) */}
      <header className="sr-only">
        <h1>Contact Rokto Lagbe - Smart Emergency Network</h1>
      </header>

      {/* Animated Background Blobs */}
      <div className="absolute inset-0 w-full h-full pointer-events-none -z-10">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-900/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-900/10 rounded-full blur-[120px] animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-950/30 border border-red-900/50 text-red-500 font-bold text-sm mb-6">
            <MessageSquare className="w-4 h-4" /> Let's Connect
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
            Get in <span className="text-red-600">Touch</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto font-medium text-lg">
            Have a question, feedback, or need emergency support? Our team is
            always here to help you. Drop us a message below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* ================= LEFT COLUMN: CONTACT INFO ================= */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-8 rounded-[2rem] shadow-xl hover:border-slate-700 transition-colors group">
              <div className="w-14 h-14 bg-red-950/50 rounded-2xl flex items-center justify-center mb-6 border border-red-900/50 group-hover:scale-110 transition-transform">
                <Phone className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-xl font-black text-white mb-2">Call Us</h3>
              <p className="text-slate-400 font-medium mb-1">
                For immediate emergency support
              </p>
              <a
                href="tel:+8801XXXXXXXXX"
                className="text-lg font-bold text-red-400 hover:text-red-300 transition-colors cursor-pointer"
              >
                +880 1XX XXX XXXX
              </a>
            </div>

            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-8 rounded-[2rem] shadow-xl hover:border-slate-700 transition-colors group">
              <div className="w-14 h-14 bg-blue-950/50 rounded-2xl flex items-center justify-center mb-6 border border-blue-900/50 group-hover:scale-110 transition-transform">
                <Mail className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="text-xl font-black text-white mb-2">Email Us</h3>
              <p className="text-slate-400 font-medium mb-1">
                For general queries & partnerships
              </p>
              <a
                href="mailto:support@roktolagbe.com"
                className="text-lg font-bold text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
              >
                support@roktolagbe.com
              </a>
            </div>

            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-8 rounded-[2rem] shadow-xl hover:border-slate-700 transition-colors group">
              <div className="w-14 h-14 bg-emerald-950/50 rounded-2xl flex items-center justify-center mb-6 border border-emerald-900/50 group-hover:scale-110 transition-transform">
                <MapPin className="w-6 h-6 text-emerald-500" />
              </div>
              <h3 className="text-xl font-black text-white mb-2">Location</h3>
              <p className="text-slate-400 font-medium mb-1">HQ & Operations</p>
              <p className="text-lg font-bold text-emerald-400">
                Manikganj, Dhaka, Bangladesh
              </p>
            </div>
          </div>

          {/* ================= RIGHT COLUMN: CONTACT FORM ================= */}
          <div className="lg:col-span-3">
            <div className="bg-slate-900/60 backdrop-blur-2xl border border-slate-800 p-8 md:p-10 rounded-[2.5rem] shadow-2xl">
              <h3 className="text-2xl font-black text-white mb-8 border-b border-slate-800 pb-4">
                Send us a Message
              </h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="name"
                      className="font-bold text-slate-300 ml-1"
                    >
                      Your Name
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="h-14 rounded-xl bg-slate-950/50 border-slate-800 text-white focus:border-red-500 focus:ring-red-500/20 font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="font-bold text-slate-300 ml-1"
                    >
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="hello@example.com"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="h-14 rounded-xl bg-slate-950/50 border-slate-800 text-white focus:border-red-500 focus:ring-red-500/20 font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="subject"
                    className="font-bold text-slate-300 ml-1"
                  >
                    Subject
                  </Label>
                  <Input
                    id="subject"
                    type="text"
                    placeholder="How can we help you?"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="h-14 rounded-xl bg-slate-950/50 border-slate-800 text-white focus:border-red-500 focus:ring-red-500/20 font-medium"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="message"
                    className="font-bold text-slate-300 ml-1"
                  >
                    Your Message
                  </Label>
                  <textarea
                    id="message"
                    rows={5}
                    placeholder="Write your message here..."
                    required
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full p-4 rounded-xl bg-slate-950/50 border border-slate-800 text-white focus:border-red-500 focus:ring-red-500/20 focus:outline-none transition-all font-medium resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-14 text-lg font-bold rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white shadow-xl shadow-red-600/20 transition-all hover:-translate-y-1 cursor-pointer disabled:translate-y-0 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Sending
                      Message...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-5 w-5" /> Send Message
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* ================= CUSTOM TOAST NOTIFICATION ================= */}
      <div
        className={`fixed bottom-8 right-8 z-[9999] transition-all duration-500 transform ${
          toast.show
            ? "translate-y-0 opacity-100"
            : "translate-y-10 opacity-0 pointer-events-none"
        }`}
      >
        <div
          className={`flex items-start gap-4 p-5 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] border backdrop-blur-xl max-w-sm ${
            toast.type === "success"
              ? "bg-emerald-950/80 border-emerald-900/50"
              : "bg-red-950/80 border-red-900/50"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
          ) : (
            <X className="w-6 h-6 text-red-500 shrink-0" />
          )}

          <div className="flex-1">
            <h4
              className={`text-sm font-black mb-1 ${toast.type === "success" ? "text-emerald-400" : "text-red-400"}`}
            >
              {toast.type === "success" ? "Message Sent!" : "Error!"}
            </h4>
            <p className="text-slate-300 text-sm font-medium leading-relaxed">
              {toast.message}
            </p>
          </div>

          <button
            onClick={() => setToast({ ...toast, show: false })}
            className="text-slate-500 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
