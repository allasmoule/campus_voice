"use client";

import { useState } from "react";

const PAYMENT_METHODS = ["BTC", "ETH", "USDT", "Other crypto"];
type AdType = "" | "image" | "video" | "code";

export default function AdvertiseInquiryModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ name: "", email: "", paymentMethod: "", durationDays: "", message: "" });
  const [adType, setAdType] = useState<AdType>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [customCode, setCustomCode] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setError("");
    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("email", form.email);
      fd.append("paymentMethod", form.paymentMethod);
      fd.append("durationDays", form.durationDays);
      fd.append("message", form.message);
      fd.append("adType", adType);
      if (adType === "image") {
        if (imageFile) fd.append("image_upload", imageFile);
        if (imageUrl) fd.append("image_url", imageUrl);
      } else if (adType === "video") {
        if (videoFile) fd.append("video_upload", videoFile);
        if (videoUrl) fd.append("video_url", videoUrl);
      } else if (adType === "code") {
        fd.append("customCode", customCode);
      }

      const res = await fetch("/backend/advertising-inquiry.php", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setError(data.error || "Something went wrong.");
        return;
      }
      setStatus("success");
    } catch {
      setStatus("error");
      setError("Something went wrong. Please try again.");
    }
  };

  const typeBtn = (active: boolean) =>
    `flex-1 border rounded-lg py-2 text-xs font-semibold transition ${
      active ? "border-blue-600 bg-blue-50 text-blue-700" : "border-gray-300 text-gray-600 hover:bg-gray-50"
    }`;

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center px-4 py-8"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white rounded-2xl w-full max-w-md p-6 relative shadow-xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {status === "success" ? (
          <div className="text-center py-6">
            <div className="text-4xl mb-3">✓</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Thank You</h2>
            <p className="text-sm text-gray-600">Your advertising inquiry has been sent. We&apos;ll get back to you by email soon.</p>
            <button
              onClick={onClose}
              className="mt-5 bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-blue-800 transition"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-lg font-bold text-gray-900 mb-1">Advertise With Us</h2>
            <p className="text-sm text-gray-500 mb-5">Tell us a bit about what you're looking for and we'll follow up by email.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Payment method</label>
                  <select
                    required
                    value={form.paymentMethod}
                    onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Choose…</option>
                    {PAYMENT_METHODS.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Days to run ad</label>
                  <input
                    type="number"
                    min={1}
                    max={3650}
                    required
                    value={form.durationDays}
                    onChange={(e) => setForm({ ...form, durationDays: e.target.value })}
                    placeholder="e.g. 30"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Message (optional)</label>
                <textarea
                  rows={2}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="pt-2 border-t border-gray-100">
                <label className="block text-xs font-semibold text-gray-700 mb-2">Upload your ad (optional)</label>
                <div className="flex gap-2 mb-3">
                  <button type="button" className={typeBtn(adType === "image")} onClick={() => setAdType(adType === "image" ? "" : "image")}>Image</button>
                  <button type="button" className={typeBtn(adType === "video")} onClick={() => setAdType(adType === "video" ? "" : "video")}>Video</button>
                  <button type="button" className={typeBtn(adType === "code")} onClick={() => setAdType(adType === "code" ? "" : "code")}>Code</button>
                </div>

                {adType === "image" && (
                  <div className="space-y-2 bg-gray-50 rounded-lg p-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                      className="w-full text-xs"
                    />
                    <input
                      type="text"
                      placeholder="...or paste an image URL"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                )}
                {adType === "video" && (
                  <div className="space-y-2 bg-gray-50 rounded-lg p-3">
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => setVideoFile(e.target.files?.[0] ?? null)}
                      className="w-full text-xs"
                    />
                    <input
                      type="text"
                      placeholder="...or paste a video URL"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                )}
                {adType === "code" && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <textarea
                      rows={4}
                      placeholder="Paste your ad HTML/JS snippet"
                      value={customCode}
                      onChange={(e) => setCustomCode(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs font-mono resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                )}
              </div>

              {status === "error" && (
                <p className="text-xs text-red-600">{error}</p>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full bg-blue-700 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-800 transition disabled:opacity-50"
              >
                {status === "loading" ? "Sending…" : "Send Message"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
