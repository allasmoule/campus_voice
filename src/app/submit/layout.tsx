import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Share Your Experience",
  description: "Share your higher education experience anonymously — no login, no tracking, no IP logging.",
};

export default function SubmitLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
