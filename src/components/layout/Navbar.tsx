"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { NAV_LINKS } from "@/lib/constants";
import SearchModal from "@/components/ui/SearchModal";

const voicesDropdown = [
  {
    title: "Student Experiences",
    desc: "First-hand stories from undergrad and grad students",
    href: "/categories/voices?filter=student",
    icon: "M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.62 48.62 0 0112 20.904a48.62 48.62 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.636 50.636 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.903 59.903 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5",
    color: "#2563eb",
  },
  {
    title: "Faculty Perspectives",
    desc: "Insights from professors, adjuncts, and instructors",
    href: "/categories/voices?filter=faculty",
    icon: "M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z",
    color: "#7c3aed",
  },
  {
    title: "Staff Stories",
    desc: "Behind-the-scenes voices from campus staff",
    href: "/categories/voices?filter=staff",
    icon: "M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z",
    color: "#059669",
  },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [voicesOpen, setVoicesOpen] = useState(false);
  const [mobileVoicesOpen, setMobileVoicesOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setVoicesOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
              {NAV_LINKS.map((link) =>
                link.name === "Voices" ? (
                  <div key="voices" className="relative" ref={dropdownRef}>
                    <button
                      className="flex items-center gap-0.5 text-[13px] font-medium text-gray-700 hover:text-[#1D4ED8] transition-colors"
                      onClick={() => setVoicesOpen(!voicesOpen)}
                    >
                      Voices
                      <svg className={`h-3 w-3 transition-transform ${voicesOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {voicesOpen && (
                      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50">
                        <div className="p-2">
                          {voicesDropdown.map((item) => (
                            <Link
                              key={item.title}
                              href={item.href}
                              className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                              onClick={() => setVoicesOpen(false)}
                            >
                              <div
                                className="flex items-center justify-center w-9 h-9 rounded-lg shrink-0 mt-0.5"
                                style={{ backgroundColor: item.color + "15", color: item.color }}
                              >
                                <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                                </svg>
                              </div>
                              <div>
                                <div className="text-sm font-semibold text-gray-900 group-hover:text-[#1D4ED8] transition-colors">
                                  {item.title}
                                </div>
                                <div className="text-xs text-gray-500 mt-0.5">{item.desc}</div>
                              </div>
                            </Link>
                          ))}
                        </div>
                        <div className="border-t border-gray-100 p-2">
                          <Link
                            href="/categories/voices"
                            className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                            onClick={() => setVoicesOpen(false)}
                          >
                            <span className="text-sm font-medium text-[#1D4ED8]">View All Voices</span>
                            <svg className="w-4 h-4 text-[#1D4ED8] group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                            </svg>
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="text-[13px] font-medium text-gray-700 hover:text-[#1D4ED8] transition-colors"
                  >
                    {link.name}
                  </Link>
                )
              )}
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
              <div className="flex flex-col gap-1">
                {NAV_LINKS.map((link) =>
                  link.name === "Voices" ? (
                    <div key="voices-mobile">
                      <button
                        className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
                        onClick={() => setMobileVoicesOpen(!mobileVoicesOpen)}
                      >
                        Voices
                        <svg className={`h-4 w-4 transition-transform ${mobileVoicesOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {mobileVoicesOpen && (
                        <div className="ml-4 mt-1 space-y-1 border-l-2 border-gray-100 pl-3">
                          {voicesDropdown.map((item) => (
                            <Link
                              key={item.title}
                              href={item.href}
                              className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg"
                              onClick={() => { setMobileOpen(false); setMobileVoicesOpen(false); }}
                            >
                              <div
                                className="w-7 h-7 rounded-md flex items-center justify-center shrink-0"
                                style={{ backgroundColor: item.color + "15", color: item.color }}
                              >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                                </svg>
                              </div>
                              {item.title}
                            </Link>
                          ))}
                          <Link
                            href="/categories/voices"
                            className="block px-3 py-2 text-sm font-medium text-[#1D4ED8] hover:bg-gray-50 rounded-lg"
                            onClick={() => { setMobileOpen(false); setMobileVoicesOpen(false); }}
                          >
                            View All Voices →
                          </Link>
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      key={link.name}
                      href={link.href}
                      className="px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
                      onClick={() => setMobileOpen(false)}
                    >
                      {link.name}
                    </Link>
                  )
                )}
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
