import Link from "next/link";
import { CATEGORIES } from "@/lib/constants";

const categoryIcons: Record<string, React.ReactNode> = {
  newspaper: (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
  ),
  "message-circle": (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
  ),
  heart: (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
  ),
  briefcase: (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
  ),
  activity: (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
  ),
  megaphone: (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>
  ),
};

export default function CategoryBar() {
  return (
    <section className="border-y border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex items-start justify-between animate-stagger">
          {CATEGORIES.map((cat, i) => (
            <div key={cat.slug} className="flex items-start">
              <Link
                href={`/categories/${cat.slug}`}
                className="flex flex-col items-center gap-1.5 py-2 px-4 group"
              >
                {/* Outlined circle icon — matching mockup */}
                <div
                  className="flex items-center justify-center w-10 h-10 rounded-full border-2 group-hover:scale-110 transition-transform"
                  style={{ borderColor: cat.color, color: cat.color }}
                >
                  {categoryIcons[cat.icon]}
                </div>
                <div className="text-center">
                  <p className="text-xs font-bold text-gray-900">{cat.name}</p>
                  <p className="text-[10px] text-gray-500 hidden sm:block leading-tight mt-0.5 max-w-[120px]">
                    {cat.description}
                  </p>
                </div>
              </Link>
              {/* Vertical divider between categories */}
              {i < CATEGORIES.length - 1 && (
                <div className="hidden sm:block w-px h-16 bg-gray-200 self-center mx-1" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
