import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login to Your Emergency Dashboard",
  description: "Access your Rokto Lagbe? profile to update your donation history, oxygen stock, or volunteer availability status instantly.",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
