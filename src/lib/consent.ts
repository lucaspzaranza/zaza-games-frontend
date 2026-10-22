export const CONSENT_STORAGE_KEY = "zaza-cookie-consent-v1";
export const CONSENT_CHANGE_EVENT = "zaza-cookie-consent-change";
export const CONSENT_SETTINGS_OPEN_EVENT = "zaza-cookie-settings-open";
export const CONSENT_VERSION = 1;
export const CONSENT_MAX_AGE_MS = 180 * 24 * 60 * 60 * 1000;

export type ConsentChoices = {
  analytics: boolean;
  marketing: boolean;
  externalMedia: boolean;
};

export type StoredConsent = ConsentChoices & {
  version: number;
  savedAt: number;
};

export const deniedConsent: ConsentChoices = {
  analytics: false,
  marketing: false,
  externalMedia: false,
};

let consentInMemory: StoredConsent | null = null;

export function readConsent(): StoredConsent | null {
  if (typeof window === "undefined") return null;

  try {
    const value = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!value) {
      consentInMemory = null;
      return null;
    }

    const parsed: unknown = JSON.parse(value);
    if (!parsed || typeof parsed !== "object") return null;

    const consent = parsed as Partial<StoredConsent>;
    if (
      consent.version !== CONSENT_VERSION ||
      typeof consent.savedAt !== "number" ||
      Date.now() - consent.savedAt > CONSENT_MAX_AGE_MS ||
      typeof consent.analytics !== "boolean" ||
      typeof consent.marketing !== "boolean" ||
      typeof consent.externalMedia !== "boolean"
    ) {
      consentInMemory = null;
      window.localStorage.removeItem(CONSENT_STORAGE_KEY);
      return null;
    }

    consentInMemory = consent as StoredConsent;
    return consent as StoredConsent;
  } catch {
    return consentInMemory;
  }
}

export function saveConsent(choices: ConsentChoices): StoredConsent {
  const consent: StoredConsent = {
    ...choices,
    version: CONSENT_VERSION,
    savedAt: Date.now(),
  };
  consentInMemory = consent;

  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consent));
  } catch {
    // The page still honors the choice in memory if browser storage is unavailable.
  }
  window.dispatchEvent(new CustomEvent<StoredConsent>(CONSENT_CHANGE_EVENT, { detail: consent }));

  return consent;
}
