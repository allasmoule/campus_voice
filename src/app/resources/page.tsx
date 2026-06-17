import Link from "next/link";
import { AdTop, AdMid, AdBottom } from "@/components/ads/PageAds";

export const metadata = {
  title: "Resources",
  description: "Mental health, reporting, and support resources for the higher education community.",
};

const resources = [
  {
    category: "Mental Health & Crisis Support",
    items: [
      { name: "988 Suicide & Crisis Lifeline", description: "Call or text 988 for 24/7 support.", url: "https://988lifeline.org" },
      { name: "Crisis Text Line", description: "Text HOME to 741741 for free crisis counseling.", url: "https://www.crisistextline.org" },
      { name: "NAMI Helpline", description: "1-800-950-NAMI for mental health support.", url: "https://www.nami.org/help" },
    ],
  },
  {
    category: "Title IX & Discrimination Reporting",
    items: [
      { name: "Know Your IX", description: "Resources for understanding your Title IX rights.", url: "https://www.knowyourix.org" },
      { name: "U.S. Dept. of Education OCR", description: "File a complaint about discrimination in education.", url: "https://www.ed.gov/ocr" },
    ],
  },
  {
    category: "Student Advocacy",
    items: [
      { name: "United Students Against Sweatshops", description: "Student labor organizing and advocacy.", url: "https://usas.org" },
      { name: "Student Press Law Center", description: "Free legal help for student journalists.", url: "https://splc.org" },
    ],
  },
  {
    category: "Faculty & Staff Support",
    items: [
      { name: "AAUP", description: "American Association of University Professors — academic freedom advocacy.", url: "https://www.aaup.org" },
      { name: "Faculty Forward Network", description: "Resources for adjunct and contingent faculty.", url: "https://www.seiu.org" },
    ],
  },
];

export default function ResourcesPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-3">Resources</h1>
      <p className="text-gray-600 mb-10">
        If you or someone you know needs support, these organizations can help.
      </p>

      <AdTop page="resources" />

      <div className="space-y-10">
        {resources.slice(0, 2).map((group) => (
          <section key={group.category}>
            <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">{group.category}</h2>
            <div className="space-y-4">
              {group.items.map((item) => (
                <div key={item.name} className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition">
                  <h3 className="font-semibold text-gray-900">{item.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-blue-700 text-sm hover:underline mt-2 inline-block">
                    Visit Resource →
                  </a>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <AdMid page="resources" />

      <div className="space-y-10">
        {resources.slice(2).map((group) => (
          <section key={group.category}>
            <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">{group.category}</h2>
            <div className="space-y-4">
              {group.items.map((item) => (
                <div key={item.name} className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition">
                  <h3 className="font-semibold text-gray-900">{item.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-blue-700 text-sm hover:underline mt-2 inline-block">
                    Visit Resource →
                  </a>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mt-12 text-sm text-amber-800">
        <strong>Disclaimer:</strong> TheCampusVoice is not a crisis service. If you are in immediate danger, please call 911 or your local emergency services.
        The resources listed here are provided for informational purposes and do not constitute endorsement.
      </div>

      <AdBottom page="resources" />
    </main>
  );
}
