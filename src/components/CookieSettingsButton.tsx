"use client";

import { CONSENT_SETTINGS_OPEN_EVENT } from "@/lib/consent";

export default function CookieSettingsButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(CONSENT_SETTINGS_OPEN_EVENT))}
      className="underline decoration-white/50 underline-offset-4 hover:text-gold-glow"
    >
      {label}
    </button>
  );
}
