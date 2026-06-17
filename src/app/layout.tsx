import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BackToTop from "@/components/ui/BackToTop";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "TheCampusVoice — Real Stories from Higher Education",
    template: "%s | TheCampusVoice",
  },
  description:
    "A confidential, research-driven platform capturing how students, faculty, and staff experience academic environments.",
  keywords: [
    "higher education experiences",
    "academic climate",
    "campus culture",
    "student experience",
    "faculty experiences",
    "diversity in higher education",
    "campus climate research",
  ],
  openGraph: {
    title: "TheCampusVoice — Real Stories from Higher Education",
    description:
      "A confidential, research-driven platform capturing how students, faculty, and staff experience academic environments.",
    siteName: "TheCampusVoice",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TheCampusVoice",
    description:
      "Real stories. Real students. Real professors. Real impact.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-gray-900">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <BackToTop />
      </body>
    </html>
  );
}
