import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manage Your Profile & Donor Status | Rokto Lagbe?",
  description:
    "Update your last donation date, manage services, and toggle your status to help people in medical emergencies near you.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
