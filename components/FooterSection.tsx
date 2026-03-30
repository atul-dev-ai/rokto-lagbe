import Link from "next/link";
import {
  Droplet,
  Heart,
  ShieldAlert,
  Mail,
  MapPin,
  Phone,
  Github,
  Facebook,
  Twitter,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="relative bg-[#050505] text-slate-300 overflow-hidden border-t border-red-950/50">
      {/* 🟢 Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] md:w-[600px] h-[300px] bg-red-600/10 blur-[100px] pointer-events-none rounded-full"></div>
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none"></div>

      <div className="container mx-auto px-4 py-16 relative z-10 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* 1. Brand Section (Takes 2 columns on large screens) */}
          <div className="space-y-4 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <Droplet className="w-8 h-8 text-red-600 fill-red-600" />
              <span className="text-3xl font-black text-white tracking-tight">
                Rokto<span className="text-red-600">Lagbe?</span>
              </span>
            </Link>
            <p className="text-sm font-medium text-slate-400 leading-relaxed max-w-sm">
              Bangladesh's First Smart Emergency Ecosystem. Connect with blood
              donors, oxygen suppliers, and volunteers instantly when it matters
              the most.
            </p>
          </div>

          {/* 🟢 2. Links Section (Grid: 2 columns on mobile, auto on desktop) */}
          <div className="grid grid-cols-2 gap-8 lg:col-span-2">
            {/* Quick Links */}
            <div className="space-y-5">
              <h4 className="text-lg font-bold text-white uppercase tracking-wider">
                Quick Links
              </h4>
              <ul className="space-y-3 text-sm font-medium">
                <li>
                  <Link
                    href="/#search-section"
                    className="hover:text-red-400 transition-colors flex items-center gap-3"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>{" "}
                    Find Blood
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#oxygen-section"
                    className="hover:text-blue-400 transition-colors flex items-center gap-3"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>{" "}
                    Oxygen Support
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#volunteers-section"
                    className="hover:text-emerald-400 transition-colors flex items-center gap-3"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>{" "}
                    Volunteers
                  </Link>
                </li>
                <li>
                  <Link
                    href="/signup"
                    className="hover:text-white transition-colors flex items-center gap-3"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-600"></span>{" "}
                    Join as Hero
                  </Link>
                </li>
              </ul>
            </div>

            {/* 🟢 Services & Legal (New Section) */}
            <div className="space-y-5">
              <h4 className="text-lg font-bold text-white uppercase tracking-wider">
                Legal
              </h4>
              <ul className="space-y-3 text-sm font-medium">
                <li>
                  <Link
                    href="/terms"
                    className="hover:text-slate-100 transition-colors flex items-center gap-3"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>{" "}
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="hover:text-slate-100 transition-colors flex items-center gap-3"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>{" "}
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/faq"
                    className="hover:text-slate-100 transition-colors flex items-center gap-3"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>{" "}
                    FAQ & Help
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="hover:text-slate-100 transition-colors flex items-center gap-3"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>{" "}
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* 3. Admin & Social (Merged Contact into here for better spacing) */}
          <div className="space-y-6 lg:col-span-1">
            <div className="space-y-4">
              <h4 className="text-lg font-bold text-white uppercase tracking-wider">
                Reach Out
              </h4>
              <ul className="space-y-3 text-sm font-medium text-slate-400">
                <li className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-red-500 shrink-0" /> Manikganj
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-red-500 shrink-0" />{" "}
                  support@roktolagbe.com
                </li>
              </ul>
            </div>

            <Link
              href="/admin"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-950/30 border border-red-900/50 text-red-400 hover:bg-red-900/50 hover:text-white hover:border-red-500 transition-all text-sm font-bold group shadow-lg w-fit"
            >
              <ShieldAlert className="w-4 h-4 group-hover:scale-110 transition-transform" />
              Admin Portal
            </Link>

            <div className="flex items-center gap-3">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-blue-600 hover:border-blue-500 transition-all hover:-translate-y-1 text-slate-400 hover:text-white shadow-sm"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-sky-500 hover:border-sky-500 transition-all hover:-translate-y-1 text-slate-400 hover:text-white shadow-sm"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-slate-700 hover:border-slate-600 transition-all hover:-translate-y-1 text-slate-400 hover:text-white shadow-sm"
              >
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-slate-800/50 flex flex-col md:flex-row items-center justify-between gap-4 text-sm font-medium text-slate-500">
          <p>© {new Date().getFullYear()} LifeFlow. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Designed & Developed with{" "}
            <Heart className="w-4 h-4 text-red-600 fill-red-600 animate-pulse" />{" "}
            by
            <a
              href="https://atulpaul.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-rose-400 drop-shadow-[0_0_10px_rgba(220,38,38,0.8)] animate-bounce hover:scale-110 transition-transform cursor-pointer ml-1"
            >
              Atul Paul
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
