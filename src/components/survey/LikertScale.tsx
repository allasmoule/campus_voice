"use client";

import { LIKERT_OPTIONS } from "@/lib/constants";

interface LikertScaleProps {
  question: string;
  name: string;
  value: number | undefined;
  onChange: (name: string, value: number) => void;
}

export default function LikertScale({ question, name, value, onChange }: LikertScaleProps) {
  return (
    <div className="mb-6">
      <p className="text-sm font-medium text-gray-800 mb-3">{question}</p>
      <div className="flex flex-wrap gap-2">
        {LIKERT_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(name, opt.value)}
            className={`px-3 py-2 text-xs rounded-lg border transition font-medium ${
              value === opt.value
                ? "bg-blue-700 text-white border-blue-700"
                : "bg-white text-gray-600 border-gray-300 hover:border-blue-400"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
