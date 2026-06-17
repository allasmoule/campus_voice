"use client";

import { useState } from "react";
import { INSTITUTION_TYPES, ROLES, ACADEMIC_AREAS } from "@/lib/constants";
import LikertScale from "@/components/survey/LikertScale";

const STEPS = ["Context", "Respect & Safety", "Fairness & Power", "Belonging", "Climate", "Narrative", "Outcomes", "Reflection"];

const SECTION_B_RESPECT = [
  { name: "feltRespected", q: "I felt respected in my academic environment." },
  { name: "presenceLegitimate", q: "My presence was treated as legitimate." },
  { name: "contributionsTaken", q: "My contributions were taken seriously." },
  { name: "safeDisagreement", q: "I felt safe expressing disagreement." },
  { name: "comfortableHelp", q: "I felt comfortable asking for help." },
  { name: "beMyself", q: "I could be myself without fear of judgment." },
];

const SECTION_B_FAIRNESS = [
  { name: "fairEvaluation", q: "I was evaluated fairly." },
  { name: "clearExpectations", q: "Expectations were communicated clearly." },
  { name: "assessedOnWork", q: "I was assessed based on my work, not my identity." },
  { name: "overlyScrutinized", q: "I felt overly scrutinized compared to peers." },
  { name: "proveMyself", q: "I had to constantly prove myself." },
  { name: "excessiveMonitoring", q: "I experienced excessive monitoring or micromanagement." },
];

const SECTION_B_BELONGING = [
  { name: "belonging", q: "I felt a sense of belonging." },
  { name: "representation", q: "I saw people like me in leadership and faculty roles." },
  { name: "diversePerspectives", q: "Diverse perspectives were valued in my environment." },
];

const SECTION_C = [
  { name: "pressureComfort", q: "I felt pressured to accept uncomfortable situations." },
  { name: "boundariesRespected", q: "My boundaries were respected." },
  { name: "dismissiveResponse", q: "When I raised concerns, they were dismissed." },
  { name: "emotionallyDrained", q: "I felt emotionally drained by my academic environment." },
];

const SECTION_E = [
  { name: "confidenceImpact", q: "My experience positively impacted my confidence." },
  { name: "careerInfluence", q: "My experience positively influenced my career trajectory." },
  { name: "wouldRecommend", q: "I would recommend my institution to someone like me." },
];

export default function SurveyPage() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<Record<string, string | number>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const set = (name: string, value: string | number) => setData((d) => ({ ...d, [name]: value }));

  const handleSubmit = async () => {
    setStatus("loading");
    try {
      const res = await fetch("/api/survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) { setStatus("error"); setMessage(result.error); return; }
      setStatus("success");
      setMessage(result.message);
    } catch {
      setStatus("error");
      setMessage("Something went wrong.");
    }
  };

  if (status === "success") {
    return (
      <main className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="text-5xl mb-4">✓</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Thank You</h1>
        <p className="text-gray-600">{message}</p>
      </main>
    );
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Campus Experience Survey</h1>
      <p className="text-gray-600 mb-6 text-sm">
        Completely anonymous. No login, no tracking. Your responses help drive institutional change.
      </p>

      {/* Progress */}
      <div className="flex gap-1 mb-8">
        {STEPS.map((s, i) => (
          <div key={s} className={`h-2 flex-1 rounded-full ${i <= step ? "bg-blue-700" : "bg-gray-200"}`} title={s} />
        ))}
      </div>
      <p className="text-xs text-gray-500 mb-6">Step {step + 1} of {STEPS.length}: {STEPS[step]}</p>

      {/* Step 0: Context */}
      {step === 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold mb-4">Section A: Your Context</h2>
          <select value={data.institutionType || ""} onChange={(e) => set("institutionType", e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm">
            <option value="">Institution Type *</option>
            {INSTITUTION_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <select value={data.role || ""} onChange={(e) => set("role", e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm">
            <option value="">Your Role *</option>
            {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
          <select value={data.academicArea || ""} onChange={(e) => set("academicArea", e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm">
            <option value="">Academic Area *</option>
            {ACADEMIC_AREAS.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>
      )}

      {/* Step 1: Respect & Safety */}
      {step === 1 && (
        <div>
          <h2 className="text-xl font-bold mb-4">Section B: Respect & Safety</h2>
          {SECTION_B_RESPECT.map((item) => (
            <LikertScale key={item.name} question={item.q} name={item.name} value={data[item.name] as number} onChange={set} />
          ))}
        </div>
      )}

      {/* Step 2: Fairness & Power */}
      {step === 2 && (
        <div>
          <h2 className="text-xl font-bold mb-4">Section B: Fairness & Power</h2>
          {SECTION_B_FAIRNESS.map((item) => (
            <LikertScale key={item.name} question={item.q} name={item.name} value={data[item.name] as number} onChange={set} />
          ))}
        </div>
      )}

      {/* Step 3: Belonging */}
      {step === 3 && (
        <div>
          <h2 className="text-xl font-bold mb-4">Section B: Belonging</h2>
          {SECTION_B_BELONGING.map((item) => (
            <LikertScale key={item.name} question={item.q} name={item.name} value={data[item.name] as number} onChange={set} />
          ))}
        </div>
      )}

      {/* Step 4: Climate */}
      {step === 4 && (
        <div>
          <h2 className="text-xl font-bold mb-4">Section C: Campus Climate</h2>
          {SECTION_C.map((item) => (
            <LikertScale key={item.name} question={item.q} name={item.name} value={data[item.name] as number} onChange={set} />
          ))}
        </div>
      )}

      {/* Step 5: Narrative */}
      {step === 5 && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold mb-4">Section D: Your Narrative</h2>
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">Describe your overall experience (optional)</label>
            <textarea rows={4} value={(data.narrativeText as string) || ""} onChange={(e) => set("narrativeText", e.target.value)} placeholder="I felt..." className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm resize-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">Was there a standout moment — positive or negative? (optional)</label>
            <textarea rows={3} value={(data.standoutMoment as string) || ""} onChange={(e) => set("standoutMoment", e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm resize-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">What do you wish had been different? (optional)</label>
            <textarea rows={3} value={(data.wishDifferent as string) || ""} onChange={(e) => set("wishDifferent", e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm resize-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">What would improve the experience for others? (optional)</label>
            <textarea rows={3} value={(data.improveExp as string) || ""} onChange={(e) => set("improveExp", e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm resize-none" />
          </div>
        </div>
      )}

      {/* Step 6: Outcomes */}
      {step === 6 && (
        <div>
          <h2 className="text-xl font-bold mb-4">Section E: Growth & Outcomes</h2>
          {SECTION_E.map((item) => (
            <LikertScale key={item.name} question={item.q} name={item.name} value={data[item.name] as number} onChange={set} />
          ))}
        </div>
      )}

      {/* Step 7: Reflection */}
      {step === 7 && (
        <div>
          <h2 className="text-xl font-bold mb-4">Section F: Final Reflection</h2>
          <label className="block text-sm font-medium text-gray-800 mb-2">
            If you could send one message to your institution&apos;s leadership, what would it be? (optional)
          </label>
          <textarea rows={5} value={(data.institutionMessage as string) || ""} onChange={(e) => set("institutionMessage", e.target.value)} placeholder="I want you to know..." className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm resize-none" />
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <button
          type="button"
          onClick={() => setStep((s) => s - 1)}
          disabled={step === 0}
          className="px-6 py-3 rounded-lg text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition disabled:opacity-30"
        >
          Back
        </button>
        {step < STEPS.length - 1 ? (
          <button
            type="button"
            onClick={() => setStep((s) => s + 1)}
            className="px-6 py-3 rounded-lg text-sm font-semibold bg-blue-700 text-white hover:bg-blue-800 transition"
          >
            Next
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={status === "loading"}
            className="px-6 py-3 rounded-lg text-sm font-semibold bg-blue-700 text-white hover:bg-blue-800 transition disabled:opacity-50"
          >
            {status === "loading" ? "Submitting..." : "Submit Survey"}
          </button>
        )}
      </div>

      {status === "error" && (
        <p className="text-red-600 text-sm mt-4 text-center">{message}</p>
      )}

      <p className="text-xs text-gray-400 text-center mt-6">
        This survey is completely anonymous. No identifying data is collected or stored.
      </p>
    </main>
  );
}
