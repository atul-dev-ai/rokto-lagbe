"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Menu,
  X,
  Droplet,
  Wind,
  ShieldCheck,
  User,
  Moon,
  Sun,
  Home,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true); // 🟢 নতুন স্টেট: চেকিং চলছে কিনা
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);

    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user || null);
      setIsAuthChecking(false); // 🟢 চেকিং শেষ হলে লোডিং অফ করে দেবে
    };
    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
        setIsAuthChecking(false);
      },
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    setIsOpen(false);

    if (pathname === "/" && href.startsWith("/#")) {
      e.preventDefault();
      const targetId = href.replace("/#", "");
      const elem = document.getElementById(targetId);
      if (elem) {
        elem.scrollIntoView({ behavior: "smooth" });
        window.history.pushState(null, "", href);
      }
    } else if (pathname === "/" && href === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      window.history.pushState(null, "", "/");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsOpen(false);
    router.push("/login");
    router.refresh();
  };

  const navLinks = [
    { name: "Home", href: "/", icon: Home },
    { name: "Find Blood", href: "/#search-section", icon: Droplet },
    { name: "Oxygen", href: "/#oxygen-section", icon: Wind },
    { name: "Volunteers", href: "/#volunteers-section", icon: ShieldCheck },
    { name: "Contact Us", href: "/contact", icon: User },
  ];

  return (
    <>
      <nav className="fixed w-full z-50 top-0 border-b border-border/40 bg-background/95 backdrop-blur-xl transition-all duration-300">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between relative">
          {/* ================= LOGO SECTION ================= */}
          <Link
            href="/"
            onClick={(e) => handleNavClick(e, "/")}
            className="flex items-center gap-2 group z-50"
          >
            <Image
              src="/logo.png"
              alt="Rokto Lagbe Logo"
              width={36}
              height={36}
              className="object-contain group-hover:scale-110 transition-transform duration-300"
              priority
            />
            <span className="text-xl md:text-2xl font-black tracking-tight text-foreground">
              Rokto<span className="text-red-600"> Lagbe?</span>
            </span>
          </Link>

          {/* ================= DESKTOP NAV LINKS ================= */}
          <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-8 text-sm font-semibold text-muted-foreground">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="hover:text-red-500 transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* ================= DESKTOP RIGHT (Theme + Auth Buttons) ================= */}
          <div className="hidden md:flex items-center gap-4 z-50">
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-full cursor-pointer hover:bg-muted transition-colors"
                aria-label="Toggle Theme"
              >
                {theme === "dark" ? (
                  <Sun className="w-5 h-5 text-amber-500" />
                ) : (
                  <Moon className="w-5 h-5 text-slate-700" />
                )}
              </button>
            )}

            {/* 🟢 Authentication Render Logic with Skeleton Loader */}
            {isAuthChecking ? (
              // যখন চেকিং চলছে তখন সুন্দর পালসিং (Pulse) শ্যাডো দেখাবে
              <div className="flex items-center gap-3">
                <div className="w-24 h-10 bg-slate-800/40 animate-pulse rounded-xl"></div>
                <div className="w-32 h-10 bg-slate-800/40 animate-pulse rounded-xl"></div>
              </div>
            ) : user ? (
              // ইউজার লগইন করা থাকলে
              <div className="flex items-center gap-3">
                <Link href="/dashboard">
                  <Button
                    variant="outline"
                    className="rounded-xl cursor-pointer font-bold border-border/50 gap-2"
                  >
                    <LayoutDashboard className="w-4 h-4" /> Dashboard
                  </Button>
                </Link>
                <Button
                  onClick={handleLogout}
                  className="rounded-xl cursor-pointer font-bold bg-slate-800 hover:bg-red-600 text-white gap-2 transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </Button>
              </div>
            ) : (
              // ইউজার লগআউট থাকলে
              <div className="flex items-center gap-3">
                <Link href="/login">
                  <Button
                    variant="outline"
                    className="rounded-xl cursor-pointer font-bold border-border/50"
                  >
                    Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="rounded-xl cursor-pointer font-bold bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/20">
                    Join as Hero
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* ================= MOBILE RIGHT (Theme + Hamburger) ================= */}
          <div className="md:hidden flex items-center gap-2 z-50">
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-full hover:bg-muted transition-colors cursor-pointer"
                aria-label="Toggle Theme"
              >
                {theme === "dark" ? (
                  <Sun className="w-5 h-5 text-amber-500" />
                ) : (
                  <Moon className="w-5 h-5 text-slate-700" />
                )}
              </button>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 -mr-2 text-foreground focus:outline-none cursor-pointer hover:bg-muted rounded-full transition-colors"
              aria-label="Toggle Menu"
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* ================= MOBILE MENU SLIDER ================= */}
      <div
        className={`md:hidden fixed inset-0 top-16 bg-[#050505] z-40 transition-all duration-300 ease-in-out border-t border-slate-800 ${
          isOpen
            ? "opacity-100 visible translate-x-0"
            : "opacity-0 invisible translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full p-6 bg-[#050505] overflow-y-auto pb-24">
          <div className="flex flex-col gap-4 mt-2">
            {navLinks.map((link, index) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                style={{ transitionDelay: `${index * 50}ms` }}
                className={`flex items-center gap-4 text-lg font-bold p-4 rounded-2xl bg-slate-900/50 hover:bg-slate-800 border border-slate-800 transition-all duration-300 text-white ${
                  isOpen
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 translate-x-4"
                }`}
              >
                <link.icon className="w-5 h-5 text-red-500" />
                {link.name}
              </Link>
            ))}
          </div>

          <div
            className={`mt-auto pt-8 flex flex-col gap-3 transition-all duration-500 delay-300 ${isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            {/* 🟢 Mobile Authentication Render Logic with Skeleton Loader */}
            {isAuthChecking ? (
              <>
                <div className="w-full h-14 bg-slate-800/40 animate-pulse rounded-2xl"></div>
                <div className="w-full h-14 bg-slate-800/40 animate-pulse rounded-2xl"></div>
              </>
            ) : user ? (
              <>
                <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                  <Button
                    variant="outline"
                    className="w-full h-14 rounded-2xl font-bold cursor-pointer text-lg border-slate-700 text-white hover:bg-slate-800 hover:text-white"
                  >
                    <LayoutDashboard className="w-5 h-5 mr-2" /> My Dashboard
                  </Button>
                </Link>
                <Button
                  onClick={handleLogout}
                  className="w-full h-14 cursor-pointer rounded-2xl font-bold text-lg bg-slate-800 hover:bg-red-600 text-white transition-colors"
                >
                  <LogOut className="w-5 h-5 mr-2" /> Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setIsOpen(false)}>
                  <Button
                    variant="outline"
                    className="w-full h-14 cursor-pointer rounded-2xl font-bold text-lg border-slate-700 text-white hover:bg-slate-800 hover:text-white"
                  >
                    Login
                  </Button>
                </Link>
                <Link href="/signup" onClick={() => setIsOpen(false)}>
                  <Button className="w-full cursor-pointer h-14 rounded-2xl font-bold text-lg bg-red-600 hover:bg-red-700 text-white shadow-xl shadow-red-600/20">
                    Join as Hero
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
