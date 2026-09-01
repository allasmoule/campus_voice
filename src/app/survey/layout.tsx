import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Campus Experience Survey",
  description: "Take our confidential, research-grade survey capturing how students, faculty, and staff experience academic environments.",
};

export default function SurveyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
