"use client";

import { useState, useEffect } from "react";
import { AlertTriangle, X, Hammer } from "lucide-react";

export function MaintenancePopup() {
  const [isOpen, setIsOpen] = useState(false);

  // Component mount howar por popup open hobe, jate hydration error na ashe
  useEffect(() => {
    setIsOpen(true);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
      {/* Popup Card */}
      <div className="bg-[#0a0a0a] border border-red-900/30 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-[0_0_50px_rgba(220,38,38,0.15)] relative animate-in zoom-in-95 duration-300">
        {/* Close Button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 text-slate-500 hover:text-white bg-slate-900 hover:bg-red-600 rounded-full p-1.5 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center mb-6 border border-amber-500/20">
            <Hammer className="w-10 h-10 animate-pulse" />
          </div>

          <h2 className="text-2xl font-black text-white mb-3 tracking-tight">
            Testing Phase
          </h2>

          <p className="text-slate-400 font-medium mb-8 leading-relaxed">
            Welcome to{" "}
            <span className="text-red-500 font-bold">Rokto Lagbe?</span> <br />
            Our website is currently under maintenance and testing. Some
            features might not work as expected. Thank you for your patience!
          </p>

          <button
            onClick={() => setIsOpen(false)}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-lg py-3.5 rounded-xl transition-all shadow-lg shadow-red-600/20 hover:-translate-y-1"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
}
