import { deniedConsent, readConsent, type ConsentChoices } from "@/lib/consent";

export type DataLayerValue = string | number | boolean;
export type DataLayerEvent = { event: string } & Record<string, DataLayerValue>;
type DataLayerEntry = DataLayerEvent | IArguments;

declare global {
  interface Window {
    dataLayer?: DataLayerEntry[];
    gtag?: (...args: unknown[]) => void;
    __zazaAnalyticsInitialized?: boolean;
    __zazaMarketingInitialized?: boolean;
  }
}

function ensureDataLayer() {
  window.dataLayer = window.dataLayer ?? [];
  return window.dataLayer;
}

function ensureGtagQueue() {
  ensureDataLayer();
  const gtag: (...args: unknown[]) => void = window.gtag ?? function () {
    window.dataLayer?.push(arguments);
  };
  window.gtag = gtag;
  return gtag;
}

function consentModeState(choices: ConsentChoices) {
  return {
    analytics_storage: choices.analytics ? "granted" : "denied",
    ad_storage: choices.marketing ? "granted" : "denied",
    ad_user_data: choices.marketing ? "granted" : "denied",
    ad_personalization: choices.marketing ? "granted" : "denied",
    functionality_storage: "granted",
    personalization_storage: choices.marketing ? "granted" : "denied",
    security_storage: "granted",
  };
}

function consentAwarePageLocation(choices: ConsentChoices) {
  const current = new URL(window.location.href);
  const campaignParams = ["utm_source", "utm_medium", "utm_campaign", "utm_id", "utm_term", "utm_content"];
  const adClickParams = choices.marketing ? ["gclid", "gbraid", "wbraid", "fbclid", "ttclid"] : [];
  const allowedParams = [...campaignParams, ...adClickParams];
  const query = new URLSearchParams();

  for (const name of allowedParams) {
    const value = current.searchParams.get(name);
    if (value) query.set(name, value.slice(0, 100));
  }

  const safeQuery = query.toString();
  return `${current.origin}${current.pathname}${safeQuery ? `?${safeQuery}` : ""}`;
}

export function updateGoogleConsent(choices: ConsentChoices) {
  ensureGtagQueue()("consent", "update", consentModeState(choices));
}

export function trackEvent(payload: DataLayerEvent) {
  if (typeof window === "undefined") return;

  const consent = readConsent();
  if (!consent || (!consent.analytics && !consent.marketing)) return;

  ensureDataLayer().push({
    ...payload,
    page_location: payload.page_location ?? consentAwarePageLocation(consent),
    page_title: payload.page_title ?? document.title,
    analytics_consent: consent.analytics,
    marketing_consent: consent.marketing,
  });
}

export function trackConsentActivation(choices: ConsentChoices, previous: ConsentChoices = deniedConsent) {
  const analyticsGrantedNow = choices.analytics && !previous.analytics && !window.__zazaAnalyticsInitialized;
  const marketingGrantedNow = choices.marketing && !previous.marketing && !window.__zazaMarketingInitialized;

  if (analyticsGrantedNow) window.__zazaAnalyticsInitialized = true;
  if (marketingGrantedNow) window.__zazaMarketingInitialized = true;

  if (analyticsGrantedNow) trackEvent({ event: "analytics_consent_granted" });
  if (marketingGrantedNow) trackEvent({ event: "marketing_consent_granted" });

  if (analyticsGrantedNow || marketingGrantedNow) {
    trackEvent({
      event: "page_view",
    });
  }
}
