import type { Metadata } from "next";
import { Lexend, Press_Start_2P } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { siteUrl } from "@/config/site";
import CookieConsentManager from "@/components/CookieConsentManager";
import PrivacyReturnScrollRestoration from "@/components/PrivacyReturnScrollRestoration";
import "../globals.css";

const pixelFont = Press_Start_2P({ weight: "400", subsets: ["latin"], variable: "--font-press-start" });
const bodyFont = Lexend({ subsets: ["latin"], variable: "--font-lexend" });

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
        <NextIntlClientProvider>
          <PrivacyReturnScrollRestoration />
          {children}
          <CookieConsentManager gtmId={process.env.NEXT_PUBLIC_GTM_ID ?? ""} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
