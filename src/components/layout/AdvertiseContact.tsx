"use client";

import { useEffect, useState } from "react";
import AdvertiseInquiryModal from "./AdvertiseInquiryModal";

interface AdvertisingContact {
  name: string | null;
  email: string;
  phone: string | null;
  message: string | null;
}

export default function AdvertiseContact() {
  const [contact, setContact] = useState<AdvertisingContact | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/backend/settings.php")
      .then((res) => (res.ok ? res.json() : { advertising: null }))
      .then((data) => {
        if (!cancelled) setContact(data.advertising || null);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  if (!contact) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setModalOpen(true)}
        className="text-xs text-gray-400 hover:text-white transition-colors underline underline-offset-2"
      >
        {contact.message || "Contact for Advertising"}
      </button>
      {modalOpen && <AdvertiseInquiryModal onClose={() => setModalOpen(false)} />}
    </>
  );
}
