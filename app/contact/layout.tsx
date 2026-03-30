import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact with US",
  description:
    "Have questions or need assistance? Reach out to us through our contact page. We're here to help you with any inquiries about blood donation, our services, or how you can get involved. Your support can save lives!",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
