import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/Navbar";
import { MaintenancePopup } from "@/components/MaintenancePopup";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://rokto-lagbe-as.vercel.app"),

  title: {
    default: "Rokto Lagbe? | Smart Emergency Network",
    template: "%s | LifeFlow",
  },
  description:
    "Find verified blood donors and oxygen in Bangladesh. Join the fastest emergency network today.",
  keywords: [
    "Blood Donor Bangladesh",
    "Rokto Lagbe",
    "LifeFlow",
    "Emergency Oxygen",
    "Volunteers Manikganj",
    "Find Blood Now",
    "Emergency Blood Donation",
  ],
  authors: [{ name: "Atul Paul" }],
  creator: "Atul Paul",

  // 🟢 ২. গুগল সার্চ কনসোল ভেরিফিকেশন কোড এখানে বসবে
  verification: {
    google: "vBOhE-VuhIiXVbQ0jiPyPPH6Cou-K6rHEa0-1a0np0w",
  },
  // <meta name="google-site-verification" content="vBOhE-VuhIiXVbQ0jiPyPPH6Cou-K6rHEa0-1a0np0w" />

  openGraph: {
    title: "Rokto Lagbe? | LifeFlow",
    description:
      "One drop of blood can save a life. Find verified donors in your area instantly.",
    url: "https://rokto-lagbe-as.vercel.app", // Replace with your real URL
    siteName: "LifeFlow",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "LifeFlow - Smart Emergency Network",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rokto Lagbe? | LifeFlow",
    description:
      "Bangladesh's First Smart Emergency Ecosystem for Blood and Oxygen.",
    images: ["/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth scroll-pt-13" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* Eta maintenance er jonno deya hoiche jokhon kaj sesh 
          hoye jabe tokhon eta comment kore deya hobe */}
          <MaintenancePopup />
          <Navbar />
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
