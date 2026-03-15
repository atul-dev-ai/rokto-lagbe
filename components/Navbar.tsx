"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
// 🟢 Home আইকন ইমপোর্ট করা হলো
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
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
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

  // কাস্টম স্ক্রল হ্যান্ডলার
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
    }
    // 🟢 Home লিংকে ক্লিক করলে যেন একদম উপরে স্মুথলি যায়
    else if (pathname === "/" && href === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      window.history.pushState(null, "", "/");
    }
  };

  // 🟢 এখানে Home লিংকটা অ্যাড করা হয়েছে
  const navLinks = [
    { name: "Home", href: "/", icon: Home },
    { name: "Find Blood", href: "/#search-section", icon: Droplet },
    { name: "Oxygen", href: "/#oxygen-section", icon: Wind },
    { name: "Volunteers", href: "/#volunteers-section", icon: ShieldCheck },
  ];

  return (
    <nav className="fixed w-full z-50 top-0 border-b border-border/40 bg-background/95 backdrop-blur-xl">
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
          <span className="text-xl md:text-2xl font-black tracking-tight text-foreground hidden sm:block">
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

        {/* ================= DESKTOP RIGHT (Theme + Buttons) ================= */}
        <div className="hidden md:flex items-center gap-4">
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-full hover:bg-muted transition-colors"
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5 text-amber-500" />
              ) : (
                <Moon className="w-5 h-5 text-slate-700" />
              )}
            </button>
          )}

          <Link href="/login">
            <Button
              variant="outline"
              className="rounded-xl font-bold border-border/50"
            >
              Login
            </Button>
          </Link>
          <Link href="/signup">
            <Button className="rounded-xl font-bold bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/20">
              Join as Hero
            </Button>
          </Link>
        </div>

        {/* ================= MOBILE RIGHT (Theme + Hamburger) ================= */}
        <div className="md:hidden flex items-center gap-2 z-50">
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-full hover:bg-muted transition-colors"
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
            className="p-2 -mr-2 text-foreground focus:outline-none"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* ================= MOBILE MENU ================= */}
      <div
        className={`md:hidden fixed inset-0 top-16 bg-[#050505] z-40 transition-all duration-300 ease-in-out border-t border-slate-800 ${
          isOpen
            ? "opacity-100 visible translate-x-0"
            : "opacity-0 invisible translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full p-6 bg-[#050505]">
          <div className="flex flex-col gap-4 mt-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="flex items-center gap-4 text-lg font-bold p-4 rounded-2xl bg-slate-900/50 hover:bg-slate-800 border border-slate-800 transition-colors text-white"
              >
                <link.icon className="w-5 h-5 text-red-500" />
                {link.name}
              </Link>
            ))}
          </div>

          <div className="mt-auto mb-10 flex flex-col gap-3">
            <Link href="/dashboard" onClick={() => setIsOpen(false)}>
              <Button
                variant="outline"
                className="w-full h-14 rounded-2xl font-bold text-lg border-slate-700 text-white hover:bg-slate-800 hover:text-white"
              >
                <User className="w-5 h-5 mr-2" /> My Dashboard
              </Button>
            </Link>
            <Link href="/signup" onClick={() => setIsOpen(false)}>
              <Button className="w-full h-14 rounded-2xl font-bold text-lg bg-red-600 hover:bg-red-700 text-white shadow-xl shadow-red-600/20">
                Join as Hero
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
