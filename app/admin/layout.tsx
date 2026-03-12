import { Metadata } from "next";

export const metadata: Metadata = {
  title: "System Administration & User Control | Rokto Lagbe?",
  description:
    "Securely monitor users, verify donors, and manage the Rokto Lagbe? emergency network from the central control panel.",
  robots: {
    index: false,
    follow: false, // 🟢 অ্যাডমিন পেজ যেন গুগল ইনডেক্স না করে সেটির ডাবল সিকিউরিটি
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
