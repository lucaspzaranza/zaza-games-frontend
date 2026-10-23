import type { Metadata } from "next";
import { Lexend, Press_Start_2P } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Script from "next/script";
import { routing } from "@/i18n/routing";
import { siteUrl } from "@/config/site";
import CookieConsentManager from "@/components/CookieConsentManager";
import PrivacyReturnScrollRestoration from "@/components/PrivacyReturnScrollRestoration";
import "../globals.css";

const pixelFont = Press_Start_2P({ weight: "400", subsets: ["latin"], variable: "--font-press-start" });
const bodyFont = Lexend({ subsets: ["latin"], variable: "--font-lexend" });

const rawGtmId = process.env.NEXT_PUBLIC_GTM_ID?.trim() ?? "";
const gtmId = /^GTM-[A-Z0-9]+$/i.test(rawGtmId) ? rawGtmId : "";
console.log("[build] GTM id:", JSON.stringify(gtmId));
const gtmBootstrap = gtmId
  ? `
      window.dataLayer = window.dataLayer || [];
      window.gtag = window.gtag || function(){ window.dataLayer.push(arguments); };
      window.gtag('consent', 'default', {
        analytics_storage: 'denied',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
        functionality_storage: 'granted',
        personalization_storage: 'denied',
        security_storage: 'granted',
        wait_for_update: 500
      });
      (function(w,d,s,l,i){
        w[l] = w[l] || [];
        w[l].push({'gtm.start': new Date().getTime(), event: 'gtm.js'});
        var j = d.createElement(s);
        var dl = l !== 'dataLayer' ? '&l=' + l : '';
        j.async = true;
        j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
        d.head.appendChild(j);
      })(window, document, 'script', 'dataLayer', ${JSON.stringify(gtmId)});
    `
  : "";

export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Meta" });
  return {
    metadataBase: new URL(siteUrl),
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `/${locale}`,
      languages: { "pt-BR": "/pt", en: "/en", "x-default": "/pt" },
    },
    icons: { icon: "/favicon.png" },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: `/${locale}`,
      siteName: "Zaza Games",
      locale: locale === "pt" ? "pt_BR" : "en_US",
      type: "website",
      images: [
        {
          url: "/og-light-blue.png",
          width: 1200,
          height: 630,
          alt: "Zaza Games",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: ["/og-light-blue.png"],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale); // keeps the page static (SSG)

  return (
    <html lang={locale === "pt" ? "pt-BR" : "en"} className={`${pixelFont.variable} ${bodyFont.variable}`}>
      <body className="font-sans antialiased">
        {gtmBootstrap && (
          <Script id="zaza-gtm-consent-bootstrap" strategy="beforeInteractive">
            {gtmBootstrap}
          </Script>
        )}
        <NextIntlClientProvider>
          <PrivacyReturnScrollRestoration />
          {children}
          <CookieConsentManager />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
