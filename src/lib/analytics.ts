export type DataLayerEvent = { event: string } & Record<string, string | number>;

declare global {
  interface Window {
    dataLayer?: DataLayerEvent[];
  }
}

export function trackEvent(payload: DataLayerEvent) {
  if (typeof window === "undefined") return;

  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push(payload);
}
