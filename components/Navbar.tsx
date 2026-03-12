"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Droplet, User, LogOut, LayoutDashboard, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/lib/supabase"; // Supabase ইমপোর্ট করলাম

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/#search-section", label: "Find Blood" },
  { href: "/#oxygen-section", label: "Oxygen" },
  { href: "/#volunteers-section", label: "Volunteers" },
];

export function Navbar() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // ডায়নামিক স্টেট
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  // কম্পোনেন্ট লোড হওয়ার সময় ইউজার চেক করা
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        setIsLoggedIn(true);
        // ডাটাবেস থেকে ইউজারের নাম আনা
        const { data } = await supabase
          .from("users_profiles")
          .select("full_name")
          .eq("user_id", session.user.id)
          .single();

        if (data) setUserName(data.full_name);
      }
    };

    fetchUser();

    // লগইন বা লগআউট হলে সাথে সাথে UI আপডেট করা
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          setIsLoggedIn(true);
          const { data } = await supabase
            .from("users_profiles")
            .select("full_name")
            .eq("user_id", session.user.id)
            .single();
          if (data) setUserName(data.full_name);
        } else {
          setIsLoggedIn(false);
          setUserName(null);
        }
      },
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // লগআউট ফাংশন
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    setUserName(null);
    closeMobileMenu();
    router.push("/");
    router.refresh();
  };

  return (
    <>
      <nav className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div
          className="container mx-auto px-4 h-16 flex items-center justify-between"
          suppressHydrationWarning
        >
          {/* ================= LOGO SECTION ================= */}
          {/* 🟢 এখানে আগের Droplet আইকন মুছে আপনার ক্যানভার লোগো বসানো হলো */}
          <Link href="/" className="flex items-center gap-2 group">
            <Image
              src="/logo.png"
              alt="LifeFlow Logo"
              width={40}
              height={40}
              className="object-contain group-hover:scale-110 transition-transform duration-300 dark:invert" // ডার্ক মোডে লোগো কালো হলে এটা সাদা করে দেবে
              priority
            />
            {/* যদি আপনার লোগো ছবিতে টেক্সট না থাকে, তবে এই লেখাটি রাখতে পারেন। আর ছবিতে টেক্সট থাকলে নিচের <span> টি মুছে দেবেন। */}
            <span className="text-2xl font-black tracking-tight text-foreground hidden sm:block">
              Rokto<span className="text-red-600"> Lagbe</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div
            className="hidden md:flex items-center space-x-8 text-sm font-semibold text-muted-foreground"
            suppressHydrationWarning
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-red-600 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3" suppressHydrationWarning>
            <ThemeToggle />

            {/* Desktop Auth */}
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full border border-border shadow-sm"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 font-bold uppercase">
                        {userName ? (
                          userName.charAt(0)
                        ) : (
                          <User className="h-5 w-5" />
                        )}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-56 mt-2"
                  align="end"
                  forceMount
                >
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {userName || "User"}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        Hero Profile
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link
                      href="/dashboard"
                      className="cursor-pointer flex items-center"
                    >
                      <LayoutDashboard className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/20 cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div
                className="hidden md:flex items-center gap-3"
                suppressHydrationWarning
              >
                <Button variant="ghost" asChild className="font-semibold">
                  <Link href="/login">Login</Link>
                </Button>
                <Button
                  className="bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-md"
                  asChild
                >
                  <Link href="/signup">Join Now</Link>
                </Button>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        <div
          suppressHydrationWarning
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            mobileMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div
            className="border-t bg-background/95 backdrop-blur-md px-4 py-4 flex flex-col gap-1 shadow-lg"
            suppressHydrationWarning
          >
            {/* Nav Links */}
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMobileMenu}
                className="flex items-center px-3 py-2.5 rounded-lg text-sm font-semibold text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
              >
                {link.label}
              </Link>
            ))}

            {/* Divider */}
            <div
              suppressHydrationWarning
              className="my-2 border-t border-border"
            />

            {/* Auth Buttons */}
            {isLoggedIn ? (
              <>
                <div
                  className="px-3 py-2 mb-2 bg-muted/50 rounded-lg"
                  suppressHydrationWarning
                >
                  <p className="text-sm font-semibold text-foreground">
                    {userName || "User"}
                  </p>
                  <p className="text-xs text-muted-foreground">Logged in</p>
                </div>
                <Link
                  href="/dashboard"
                  onClick={closeMobileMenu}
                  className="flex items-center cursor-pointer gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors text-left cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  Log out
                </button>
              </>
            ) : (
              <div
                className="flex flex-col gap-2 pt-1"
                suppressHydrationWarning
              >
                <Button
                  variant="ghost"
                  asChild
                  className="w-full font-semibold justify-center cursor-pointer"
                >
                  <Link href="/login" onClick={closeMobileMenu}>
                    Login
                  </Link>
                </Button>
                <Button
                  className="w-full bg-red-600 cursor-pointer hover:bg-red-700 text-white font-bold rounded-xl shadow-md"
                  asChild
                >
                  <Link href="/signup" onClick={closeMobileMenu}>
                    Join Now
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
