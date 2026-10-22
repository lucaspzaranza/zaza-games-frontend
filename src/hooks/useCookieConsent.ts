"use client";

import { useEffect, useState } from "react";
import { CONSENT_CHANGE_EVENT, readConsent, type StoredConsent } from "@/lib/consent";

export function useCookieConsent() {
  const [consent, setConsent] = useState<StoredConsent | null>(null);

  useEffect(() => {
    const refreshConsent = () => setConsent(readConsent());
    refreshConsent();
    window.addEventListener(CONSENT_CHANGE_EVENT, refreshConsent);
    return () => window.removeEventListener(CONSENT_CHANGE_EVENT, refreshConsent);
  }, []);

  return consent;
}
