"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  CONSENT_SETTINGS_OPEN_EVENT,
  deniedConsent,
  readConsent,
  saveConsent,
  type ConsentChoices,
  type StoredConsent,
} from "@/lib/consent";
import { trackConsentActivation, updateGoogleConsent } from "@/lib/analytics";

type Panel = "banner" | "settings" | null;
type ChoiceKey = keyof ConsentChoices;

export default function CookieConsentManager() {
  const t = useTranslations("CookieConsent");
  const locale = useLocale();
  const [consent, setConsent] = useState<StoredConsent | null>(null);
  const [draft, setDraft] = useState<ConsentChoices>(deniedConsent);
  const [panel, setPanel] = useState<Panel>(null);
  const [ready, setReady] = useState(false);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const stored = readConsent();
    setConsent(stored);
    setDraft(stored ?? deniedConsent);

    if (stored) {
      updateGoogleConsent(stored);
      trackConsentActivation(stored);
    } else {
      setPanel("banner");
    }

    setReady(true);

  }, []);

  useEffect(() => {
    const openSettings = () => {
      setDraft(readConsent() ?? deniedConsent);
      setPanel("settings");
    };
    window.addEventListener(CONSENT_SETTINGS_OPEN_EVENT, openSettings);
    return () => window.removeEventListener(CONSENT_SETTINGS_OPEN_EVENT, openSettings);
  }, []);

  function applyChoices(choices: ConsentChoices) {
    const previous = consent ?? deniedConsent;
    const saved = saveConsent(choices);
    setConsent(saved);
    setDraft(saved);
    setPanel(null);

    updateGoogleConsent(saved);
    trackConsentActivation(saved, previous);
  }

  function toggleChoice(key: ChoiceKey) {
    setDraft((current) => ({ ...current, [key]: !current[key] }));
  }

  const showPanel = ready && panel !== null;

  return (
    <>
      {showPanel && (
        <section
          aria-labelledby="cookie-consent-title"
          aria-live="polite"
          className={panel === "banner"
            ? "fixed bottom-4 left-4 right-4 z-50 sm:left-auto sm:w-[380px]"
            : "fixed inset-x-0 bottom-0 z-50 px-3 pb-3 sm:px-6 sm:pb-6"}
        >
          <div className={`max-h-[85svh] overflow-y-auto border-4 border-ink bg-snow p-4 text-ink shadow-[6px_6px_0_0_#131a33] sm:p-5 ${panel === "banner" ? "w-full" : "mx-auto w-full max-w-5xl"}`}>
            {panel === "banner" ? (
              <>
                <h2 id="cookie-consent-title" className="font-pixel text-xs leading-relaxed text-royal-shadow sm:text-sm">
                  {t("title")}
                </h2>
                <p className="mt-2 text-xs leading-relaxed sm:text-sm">{t("description")}</p>
                <div className="mt-1 flex flex-wrap items-center justify-between gap-x-2">
                  <Link href={`/${locale}/privacy`} className="inline-flex min-h-11 items-center text-xs text-royal-shadow underline underline-offset-4">
                    {t("privacyLink")}
                  </Link>
                  <button type="button" onClick={() => { setDraft(consent ?? deniedConsent); setPanel("settings"); }} className="inline-flex min-h-11 items-center border-2 border-ink/40 px-3 text-xs font-medium text-royal-shadow underline underline-offset-4 hover:bg-royal/5 hover:text-ink focus-visible:outline-2 focus-visible:outline-royal">
                    {t("customize")}
                  </button>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2 sm:gap-3">
                  <button type="button" onClick={() => applyChoices({ analytics: true, marketing: true, externalMedia: true })} className="min-h-11 border-2 border-ink bg-white px-3 py-2 text-xs font-semibold shadow-[2px_2px_0_0_#131a33] hover:bg-gold sm:text-sm">
                    {t("acceptAll")}
                  </button>
                  <button type="button" onClick={() => applyChoices(deniedConsent)} className="min-h-11 border-2 border-ink bg-white px-3 py-2 text-xs font-semibold shadow-[2px_2px_0_0_#131a33] hover:bg-gold sm:text-sm">
                    {t("reject")}
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 id="cookie-consent-title" className="font-pixel text-sm leading-relaxed text-royal-shadow sm:text-base">
                  {t("settingsTitle")}
                </h2>
                <p className="mt-3 text-sm leading-relaxed">{t("settingsIntro")}</p>

                <div className="mt-5 grid gap-3">
                  <PreferenceRow title={t("necessaryTitle")} description={t("necessaryDescription")} status={t("alwaysOn")} checked disabled />
                  <PreferenceRow title={t("analyticsTitle")} description={t("analyticsDescription")} checked={draft.analytics} onChange={() => toggleChoice("analytics")} />
                  <PreferenceRow title={t("marketingTitle")} description={t("marketingDescription")} checked={draft.marketing} onChange={() => toggleChoice("marketing")} />
                  <PreferenceRow title={t("mediaTitle")} description={t("mediaDescription")} checked={draft.externalMedia} onChange={() => toggleChoice("externalMedia")} />
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <button type="button" onClick={() => setPanel(consent ? null : "banner")} className="border-2 border-ink bg-white px-4 py-2 font-pixel text-[10px] shadow-[3px_3px_0_0_#131a33] hover:bg-gold">
                    {t("back")}
                  </button>
                  <button type="button" onClick={() => applyChoices(draft)} className="border-2 border-ink bg-white px-4 py-2 font-pixel text-[10px] shadow-[3px_3px_0_0_#131a33] hover:bg-gold">
                    {t("save")}
                  </button>
                </div>
              </>
            )}
          </div>
        </section>
      )}
    </>
  );
}

function PreferenceRow({
  title,
  description,
  checked,
  disabled = false,
  status,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  status?: string;
  onChange?: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-4 border-2 border-ink/20 bg-white p-3">
      <span>
        <span className="block font-semibold">{title}{status && <span className="ml-2 text-xs font-normal text-royal-shadow">{status}</span>}</span>
        <span className="mt-1 block text-sm leading-relaxed text-ink/80">{description}</span>
      </span>
      <input type="checkbox" checked={checked} disabled={disabled} onChange={onChange} className="mt-1 size-5 shrink-0 accent-royal disabled:cursor-not-allowed" />
    </label>
  );
}
