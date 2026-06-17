import { AdTop, AdMid, AdBottom } from "@/components/ads/PageAds";

export const metadata = {
  title: "Resources",
  description: "Mental health, reporting, and support resources for the higher education community.",
};

const resources = [
  {
    category: "Mental Health & Crisis Support",
    icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
    color: "#dc2626",
    bg: "#fef2f2",
    items: [
      { name: "988 Suicide & Crisis Lifeline", description: "Call or text 988 for free, confidential 24/7 emotional support.", url: "https://988lifeline.org", tag: "24/7" },
      { name: "Crisis Text Line", description: "Text HOME to 741741 to connect with a trained crisis counselor.", url: "https://www.crisistextline.org", tag: "Free" },
      { name: "NAMI Helpline", description: "1-800-950-NAMI — information, referrals, and support for mental health conditions.", url: "https://www.nami.org/help", tag: "Helpline" },
      { name: "JED Foundation", description: "Protecting emotional health and preventing suicide for teens and young adults.", url: "https://jedfoundation.org", tag: "Students" },
    ],
  },
  {
    category: "Title IX & Discrimination Reporting",
    icon: "M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971z",
    color: "#7c3aed",
    bg: "#f5f3ff",
    items: [
      { name: "Know Your IX", description: "Understand your rights under Title IX — guides, tools, and survivor resources.", url: "https://www.knowyourix.org", tag: "Rights" },
      { name: "U.S. Dept. of Education OCR", description: "File a formal complaint about discrimination in education programs.", url: "https://www.ed.gov/ocr", tag: "Federal" },
      { name: "End Rape on Campus", description: "Direct assistance and policy advocacy for campus sexual violence.", url: "https://endrapeoncampus.org", tag: "Advocacy" },
    ],
  },
  {
    category: "Student Advocacy & Legal",
    icon: "M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z",
    color: "#2563eb",
    bg: "#eff6ff",
    items: [
      { name: "Student Press Law Center", description: "Free legal help for student journalists and campus media.", url: "https://splc.org", tag: "Legal" },
      { name: "FIRE", description: "Foundation for Individual Rights — defending free speech and due process on campus.", url: "https://www.thefire.org", tag: "Free Speech" },
      { name: "United Students Against Sweatshops", description: "Student-led labor organizing and campus workers' rights advocacy.", url: "https://usas.org", tag: "Labor" },
    ],
  },
  {
    category: "Faculty & Staff Support",
    icon: "M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.62 48.62 0 0112 20.904a48.62 48.62 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.636 50.636 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.903 59.903 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5",
    color: "#059669",
    bg: "#ecfdf5",
    items: [
      { name: "AAUP", description: "American Association of University Professors — academic freedom and shared governance.", url: "https://www.aaup.org", tag: "Faculty" },
      { name: "Faculty Forward Network", description: "Resources, community, and advocacy for adjunct and contingent faculty.", url: "https://www.seiu.org", tag: "Adjunct" },
      { name: "Chronical Vitae", description: "Career advice, job board, and professional development for academics.", url: "https://chroniclevitae.com", tag: "Careers" },
    ],
  },
  {
    category: "Financial Aid & Scholarships",
    icon: "M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    color: "#d97706",
    bg: "#fffbeb",
    items: [
      { name: "FAFSA", description: "Free Application for Federal Student Aid — the first step to financial help.", url: "https://studentaid.gov/h/apply-for-aid/fafsa", tag: "Federal" },
      { name: "Fastweb", description: "Search millions of scholarships matched to your profile.", url: "https://www.fastweb.com", tag: "Scholarships" },
      { name: "Student Loan Borrower Assistance", description: "Navigate repayment options and loan forgiveness programs.", url: "https://studentaid.gov/manage-loans", tag: "Loans" },
    ],
  },
];

export default function ResourcesPage() {
  return (
    <main>
      {/* Hero */}
      <section className="bg-[#0f1b3d] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-20 w-64 h-64 rounded-full bg-blue-400 blur-3xl" />
          <div className="absolute bottom-10 left-20 w-48 h-48 rounded-full bg-purple-400 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 mb-5">
            <svg className="w-8 h-8 text-blue-300" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white">
            Support & Resources
          </h1>
          <p className="text-white/60 mt-3 max-w-xl mx-auto text-sm leading-relaxed">
            Whether you need immediate crisis support, legal guidance, or career resources — you&apos;re not alone. These verified organizations are here to help.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            {["Crisis Support", "Title IX", "Student Rights", "Faculty", "Financial Aid"].map((label) => (
              <span key={label} className="px-3 py-1.5 rounded-full bg-white/10 text-white/70 text-xs font-medium">
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Banner */}
      <div className="bg-red-50 border-b border-red-100">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-center gap-3 text-sm">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-red-100">
            <svg className="w-3.5 h-3.5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
            </svg>
          </span>
          <span className="text-red-800">
            <strong>In immediate danger?</strong> Call <strong>911</strong> or text <strong>988</strong> for crisis support.
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
        <AdTop page="resources" />

        <div className="space-y-12 mt-8">
          {resources.slice(0, 3).map((group) => (
            <section key={group.category}>
              <div className="flex items-center gap-3 mb-5">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl" style={{ backgroundColor: group.bg }}>
                  <svg className="w-5 h-5" style={{ color: group.color }} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d={group.icon} />
                  </svg>
                </div>
                <h2 className="text-lg font-bold text-gray-900">{group.category}</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {group.items.map((item) => (
                  <a
                    key={item.name}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg hover:border-gray-300 transition-all duration-200 flex flex-col"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 group-hover:text-[#1D4ED8] transition-colors text-sm leading-tight">
                        {item.name}
                      </h3>
                      <span
                        className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full whitespace-nowrap ml-2 shrink-0"
                        style={{ backgroundColor: group.bg, color: group.color }}
                      >
                        {item.tag}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed flex-1">{item.description}</p>
                    <div className="mt-3 flex items-center gap-1 text-xs font-medium" style={{ color: group.color }}>
                      Visit Resource
                      <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </div>
                  </a>
                ))}
              </div>
            </section>
          ))}
        </div>

        <AdMid page="resources" />

        <div className="space-y-12 mt-8">
          {resources.slice(3).map((group) => (
            <section key={group.category}>
              <div className="flex items-center gap-3 mb-5">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl" style={{ backgroundColor: group.bg }}>
                  <svg className="w-5 h-5" style={{ color: group.color }} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d={group.icon} />
                  </svg>
                </div>
                <h2 className="text-lg font-bold text-gray-900">{group.category}</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {group.items.map((item) => (
                  <a
                    key={item.name}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg hover:border-gray-300 transition-all duration-200 flex flex-col"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 group-hover:text-[#1D4ED8] transition-colors text-sm leading-tight">
                        {item.name}
                      </h3>
                      <span
                        className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full whitespace-nowrap ml-2 shrink-0"
                        style={{ backgroundColor: group.bg, color: group.color }}
                      >
                        {item.tag}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed flex-1">{item.description}</p>
                    <div className="mt-3 flex items-center gap-1 text-xs font-medium" style={{ color: group.color }}>
                      Visit Resource
                      <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </div>
                  </a>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Know Your Rights CTA */}
        <section className="mt-14 bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-50 rounded-2xl p-8 sm:p-10 text-center">
          <h2 className="text-xl font-bold text-gray-900">Know Your Rights on Campus</h2>
          <p className="text-sm text-gray-600 mt-2 max-w-lg mx-auto leading-relaxed">
            Understanding your rights is the first step to advocacy. Learn about Title IX protections, free speech, academic freedom, and student due process.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-5">
            <a href="https://www.knowyourix.org" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1D4ED8] text-white text-sm font-semibold rounded-lg hover:bg-[#1E40AF] transition-colors">
              Title IX Guide
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
            </a>
            <a href="https://www.thefire.org" target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-5 py-2.5 border-2 border-[#1D4ED8] text-[#1D4ED8] text-sm font-semibold rounded-lg hover:bg-[#1D4ED8] hover:text-white transition-colors">
              Free Speech Rights
            </a>
          </div>
        </section>

        {/* Disclaimer */}
        <div className="mt-10 bg-amber-50 border border-amber-200 rounded-xl p-5 flex gap-3 text-sm text-amber-800">
          <svg className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.345 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
          <div>
            <strong>Disclaimer:</strong> TheCampusVoice is not a crisis service. If you are in immediate danger, call 911. Resources listed are for informational purposes and do not constitute endorsement.
          </div>
        </div>

        <AdBottom page="resources" />
      </div>
    </main>
  );
}
