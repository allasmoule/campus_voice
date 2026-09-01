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

const defaultHeroBanner = "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=1200&h=630&fit=crop";

export const metadata: Metadata = {
  metadataBase: new URL("https://thecampusvoice.info"),
  title: {
    default: "TheCampusVoice — Real Stories from Higher Education",
    template: "%s | TheCampusVoice",
  },
  description:
    "Real stories. Real students. Real professors. Real impact. A confidential, research-driven platform capturing how students, faculty, and staff experience academic environments.",
  keywords: [
    "higher education experiences",
    "real student stories",
    "real professors",
    "academic climate",
    "campus culture",
    "student experience",
    "faculty experiences",
    "university reviews",
    "diversity in higher education",
    "campus climate research",
  ],
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "TheCampusVoice — Real Stories from Higher Education",
    description:
      "Real stories. Real students. Real professors. Real impact. A confidential, research-driven platform capturing academic environments.",
    url: "https://thecampusvoice.info",
    siteName: "TheCampusVoice",
    images: [
      {
        url: defaultHeroBanner,
        width: 1200,
        height: 630,
        alt: "TheCampusVoice - Real Stories. Real Students. Real Professors. Real Impact.",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TheCampusVoice — Real Stories from Higher Education",
    description:
      "Real stories. Real students. Real professors. Real impact.",
    images: [defaultHeroBanner],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLdWebsite = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "TheCampusVoice",
    url: "https://thecampusvoice.info",
    description: "Real stories. Real students. Real professors. Real impact.",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://thecampusvoice.info/stories/view?slug={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  const jsonLdOrganization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "TheCampusVoice",
    url: "https://thecampusvoice.info",
    logo: "https://thecampusvoice.info/favicon.svg",
    sameAs: [],
  };

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebsite) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrganization) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-white text-gray-900" suppressHydrationWarning>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <BackToTop />
      </body>
    </html>
  );
}
