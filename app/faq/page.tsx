"use client";

import { useState } from "react";
import {
  HelpCircle,
  ChevronDown,
  Droplet,
  Wind,
  ShieldCheck,
  AlertTriangle,
  MessageSquare,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // ডিফল্টভাবে প্রথমটা ওপেন থাকবে

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      icon: <AlertTriangle className="w-5 h-5 text-red-500" />,
      question: "Is this platform really 100% free?",
      answer:
        "Yes, absolutely! Rokto Lagbe? is a non-profitable, voluntary network. We do not charge any fees, and buying or selling blood is strictly prohibited on our platform. If anyone asks for money in exchange for blood, please report them immediately.",
    },
    {
      icon: <Droplet className="w-5 h-5 text-red-500" />,
      question: "How do I find a blood donor urgently?",
      answer:
        "Simply go to our Homepage, select your required blood group and location from the 'Search Directory', and you will see a list of available donors. You can directly contact them via their provided phone numbers.",
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-emerald-500" />,
      question: "I just donated blood today. How do I update my profile?",
      answer:
        "Log in to your account, go to 'My Dashboard', and update your 'Last Donation Date'. Our smart system will automatically hide your profile from public searches for the next 90 days to ensure you get proper rest.",
    },
    {
      icon: <Wind className="w-5 h-5 text-blue-500" />,
      question: "Can commercial oxygen suppliers join the network?",
      answer:
        "Yes. Both free (charity) and paid (commercial) oxygen suppliers can register. However, commercial suppliers must select 'Paid Service' during signup and are strictly advised not to charge unreasonable prices during medical emergencies.",
    },
    {
      icon: <MessageSquare className="w-5 h-5 text-slate-400" />,
      question: "What should I do if a donor demands money?",
      answer:
        "We have a zero-tolerance policy for blood trading. Please go to our 'Contact' page and send us a message with the user's name and phone number. We will permanently ban their account and take necessary actions.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#050505] pt-24 pb-16 relative overflow-hidden">
      {/* 🟢 SEO Friendly Header */}
      <header className="sr-only">
        <h1>Frequently Asked Questions - Rokto Lagbe?</h1>
      </header>

      {/* Background Effect */}
      <div className="absolute inset-0 w-full h-full pointer-events-none -z-10">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-red-900/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-blue-900/10 rounded-full blur-[120px] animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/80 border border-slate-800 text-slate-400 font-bold text-sm mb-6 shadow-sm">
            <HelpCircle className="w-4 h-4 text-blue-400" /> Need Help?
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
            Frequently Asked <span className="text-red-600">Questions</span>
          </h2>
          <p className="text-slate-400 font-medium max-w-2xl mx-auto text-lg">
            Find quick answers to common questions about using the Rokto Lagbe?
            emergency network.
          </p>
        </div>

        {/* 🟢 Custom Smooth Accordion Section */}
        <div className="space-y-4 max-w-3xl mx-auto">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className={`group rounded-2xl border transition-all duration-300 ${
                  isOpen
                    ? "bg-slate-900/60 border-slate-700 shadow-xl shadow-black/50"
                    : "bg-slate-900/30 border-slate-800 hover:border-slate-700 hover:bg-slate-900/40"
                } backdrop-blur-xl overflow-hidden`}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between p-6 cursor-pointer outline-none"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-4 text-left">
                    <div
                      className={`p-2.5 rounded-xl transition-colors duration-300 ${isOpen ? "bg-slate-800" : "bg-slate-800/50 group-hover:bg-slate-800"}`}
                    >
                      {faq.icon}
                    </div>
                    <h3
                      className={`text-lg font-bold transition-colors duration-300 ${isOpen ? "text-white" : "text-slate-300 group-hover:text-white"}`}
                    >
                      {faq.question}
                    </h3>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-500 shrink-0 transition-transform duration-500 ${isOpen ? "rotate-180 text-white" : "group-hover:text-slate-300"}`}
                  />
                </button>

                {/* 🟢 Pure CSS Grid Animation for Smooth Expand/Collapse */}
                <div
                  className={`grid transition-all duration-500 ease-in-out ${
                    isOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="p-6 pt-0 text-slate-400 font-medium leading-relaxed border-t border-slate-800/50 mt-2">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Still Have Questions Section */}
        <div className="mt-16 text-center bg-red-950/10 border border-red-900/30 rounded-[2rem] p-8 md:p-12 max-w-3xl mx-auto animate-in fade-in zoom-in duration-700 delay-300">
          <h3 className="text-2xl font-black text-white mb-3">
            Still have questions?
          </h3>
          <p className="text-slate-400 font-medium mb-8">
            Can't find the answer you're looking for? Our support team is ready
            to help you out.
          </p>
          <Link href="/contact">
            <button className="px-8 py-4 rounded-xl font-bold bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/20 transition-all cursor-pointer flex items-center justify-center gap-2 mx-auto">
              Contact Support <ArrowRight className="w-5 h-5" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
