"use client";

import { useState } from "react";
import { CATEGORIES, INSTITUTION_TYPES, ROLES, ACADEMIC_AREAS } from "@/lib/constants";

export default function SubmitPage() {
  const [form, setForm] = useState({
    narrativeText: "",
    category: "",
    role: "",
    institutionType: "",
    academicArea: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "flagged" | "error">("idle");
  const [message, setMessage] = useState("");
  const [flags, setFlags] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setMessage(data.error);
        return;
      }
      if (data.flags && data.flags.length > 0) {
        setStatus("flagged");
        setFlags(data.flags);
        setMessage(data.suggestion);
      } else {
        setStatus("success");
        setMessage(data.message);
      }
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  };

  if (status === "success") {
    return (
      <main className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="text-5xl mb-4">✓</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Thank You</h1>
        <p className="text-gray-600 mb-6">{message}</p>
        <p className="text-sm text-gray-500">Your submission is completely anonymous. No identifying information was collected.</p>
      </main>
    );
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-3">Share Your Experience</h1>
      <p className="text-gray-600 mb-2">
        Your story matters. Share your experience anonymously — no login, no tracking, no IP logging.
      </p>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8 text-sm text-amber-800">
        <strong>⚠ Important Guidelines:</strong>
        <ul className="mt-2 space-y-1 list-disc list-inside">
          <li>This platform collects <strong>personal experiences</strong>, not verified claims.</li>
          <li>Use experience-based language: &quot;I felt...&quot; not &quot;They did...&quot;</li>
          <li>Do <strong>not</strong> include names or identifying information about individuals.</li>
          <li>Submissions are moderated before publication.</li>
        </ul>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <select required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <option value="">Category *</option>
            {CATEGORIES.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
          </select>
          <select required value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <option value="">Your Role *</option>
            {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
          <select required value={form.institutionType} onChange={(e) => setForm({ ...form, institutionType: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <option value="">Institution Type *</option>
            {INSTITUTION_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <select required value={form.academicArea} onChange={(e) => setForm({ ...form, academicArea: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <option value="">Academic Area *</option>
            {ACADEMIC_AREAS.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>

        <div>
          <textarea
            required
            rows={8}
            placeholder="Share your experience here... Use 'I felt...' language to describe your personal experience. Minimum 20 characters."
            value={form.narrativeText}
            onChange={(e) => setForm({ ...form, narrativeText: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          />
          <p className="text-xs text-gray-400 mt-1">{form.narrativeText.length} characters</p>
        </div>

        {status === "flagged" && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-sm text-orange-800">
            <strong>Your submission was flagged for review:</strong>
            <ul className="mt-2 list-disc list-inside">
              {flags.map((f, i) => <li key={i}>{f}</li>)}
            </ul>
            <p className="mt-2">{message}</p>
          </div>
        )}

        {status === "error" && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">{message}</div>
        )}

        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full bg-blue-700 text-white py-3 rounded-lg font-semibold hover:bg-blue-800 transition disabled:opacity-50"
        >
          {status === "loading" ? "Submitting..." : "Submit Anonymously"}
        </button>

        <p className="text-xs text-gray-400 text-center">
          By submitting, you confirm this reflects your personal experience. No identifying data is collected.
        </p>
      </form>
    </main>
  );
}
