"use client";

import Link from "next/link";
import { useState } from "react";
import { NAV_LINKS } from "@/lib/constants";
import SearchModal from "@/components/ui/SearchModal";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-1.5">
              <span className="text-xl font-bold text-gray-900 tracking-tight">
                <span className="text-gray-500 font-normal">the</span>
                CampusVoice
              </span>
              <svg className="h-6 w-6 text-[#1D4ED8]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
              </svg>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-5">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-[13px] font-medium text-gray-700 hover:text-[#1D4ED8] transition-colors"
                >
                  {link.name}
                  {link.name === "Voices" && (
                    <svg className="inline ml-0.5 h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  )}
                </Link>
              ))}
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                aria-label="Search"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              <Link
                href="/write-for-us"
                className="hidden sm:inline-flex items-center px-4 py-1.5 rounded-full bg-[#1D4ED8] text-white text-sm font-medium hover:bg-[#1E40AF] transition-colors"
              >
                Write for Us
              </Link>

              <button
                className="p-2 text-gray-500 hover:text-gray-700"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle menu"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {mobileOpen && (
            <div className="lg:hidden border-t border-gray-200 py-4">
              <div className="flex flex-col gap-2">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
                <Link
                  href="/write-for-us"
                  className="mx-3 mt-2 inline-flex items-center justify-center px-4 py-2 rounded-full bg-[#1D4ED8] text-white text-sm font-medium"
                  onClick={() => setMobileOpen(false)}
                >
                  Write for Us
                </Link>
              </div>
            </div>
          )}
        </nav>
      </header>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
