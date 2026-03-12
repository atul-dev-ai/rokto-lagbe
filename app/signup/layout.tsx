import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Become a Hero: Join the Rokto Lagbe? Emergency Network",
  description:
    "Register as a blood donor, volunteer, or oxygen supplier. Join Bangladesh's smart emergency network to save lives today.",
};

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
