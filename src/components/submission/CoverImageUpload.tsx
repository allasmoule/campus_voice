"use client";

import { useRef, useState } from "react";

interface CoverImageUploadProps {
  imageUrl: string | null;
  onChange: (url: string | null) => void;
  onUpload: (file: File) => Promise<string>;
}

export default function CoverImageUpload({ imageUrl, onChange, onUpload }: CoverImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (file: File) => {
    setUploading(true);
    setError("");
    try {
      const url = await onUpload(file);
      onChange(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  if (imageUrl) {
    return (
      <div className="relative rounded-lg overflow-hidden border border-gray-200">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imageUrl} alt="Cover" className="w-full h-56 object-cover" />
        <button
          type="button"
          onClick={() => onChange(null)}
          className="absolute top-3 right-3 bg-black/60 text-white text-xs px-3 py-1.5 rounded-md hover:bg-black/80 transition"
        >
          Remove
        </button>
      </div>
    );
  }

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 flex flex-col items-center justify-center py-10 gap-3">
      <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M4 8h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <p className="text-sm text-gray-500">Add a cover image to your article.</p>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="inline-flex items-center gap-2 border border-gray-300 rounded-full px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 transition bg-white"
      >
        {uploading ? "Uploading…" : "Upload from computer"}
      </button>
      {error && <p className="text-xs text-red-600">{error}</p>}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}
