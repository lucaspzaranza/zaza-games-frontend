const rawGtmId = process.env.NEXT_PUBLIC_GTM_ID?.trim() ?? "";
const gtmId = /^GTM-[A-Z0-9]+$/i.test(rawGtmId) ? rawGtmId : "";

if (gtmId) {
  const dataLayer = window.dataLayer ?? [];
  window.dataLayer = dataLayer;
  const gtag =
    window.gtag ??
    function gtag() {
      dataLayer.push(arguments);
    };
  window.gtag = gtag;

  gtag("consent", "default", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    functionality_storage: "granted",
    personalization_storage: "denied",
    security_storage: "granted",
    wait_for_update: 500,
  });

  dataLayer.push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
  const script = document.createElement("script");
  const firstScript = document.getElementsByTagName("script")[0];
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${gtmId}`;

  if (firstScript?.parentNode) {
    firstScript.parentNode.insertBefore(script, firstScript);
  } else {
    document.head.appendChild(script);
  }
}
