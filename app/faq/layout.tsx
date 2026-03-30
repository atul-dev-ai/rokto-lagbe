import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Frequently Asked Questions (FAQ)",
  description:
    "Find answers to common questions about blood donation, our services, and how you can get involved. Whether you're a first-time donor or a regular hero, our FAQ section has the information you need to make information decisions and save lives with Rokto Lagbe?",
};

export default function FaqLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
