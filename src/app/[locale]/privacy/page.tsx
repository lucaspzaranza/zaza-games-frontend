import Link from "next/link";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Header, Footer } from "@/components/sections";

const providers = [
  { labelKey: "google" as const, href: "https://policies.google.com/privacy" },
  { labelKey: "meta" as const, href: "https://www.facebook.com/privacy/policy/" },
  { labelKey: "tiktok" as const, href: "https://www.tiktok.com/legal/page/row/privacy-policy/en" },
];

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Privacy" });
  return { title: t("title"), description: t("intro") };
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Privacy");

  return (
    <>
      <Header />
      <main className="min-h-screen bg-snow px-6 py-12 text-ink sm:py-20">
        <article className="mx-auto max-w-4xl">
          <Link href={`/${locale}`} className="mb-8 inline-block text-royal-shadow underline underline-offset-4">
            {t("backToSite")}
          </Link>
          <h1 className="font-pixel text-xl leading-relaxed text-royal-shadow sm:text-2xl">{t("title")}</h1>
          <p className="mt-5 text-lg leading-relaxed">{t("intro")}</p>
          <p className="mt-3 text-sm text-ink/70">{t("updated")}</p>

          <section className="mt-10 space-y-8 leading-relaxed">
            <div>
              <h2 className="font-pixel text-sm leading-relaxed text-royal-shadow">{t("controllerTitle")}</h2>
              <p className="mt-3">{t("controllerText")} <a href="mailto:lucaszaranza@gmail.com" className="text-royal-shadow underline">lucaszaranza@gmail.com</a>.</p>
            </div>

            <div>
              <h2 className="font-pixel text-sm leading-relaxed text-royal-shadow">{t("eventsTitle")}</h2>
              <p className="mt-3">{t("eventsText")}</p>
            </div>

            <div>
              <h2 className="font-pixel text-sm leading-relaxed text-royal-shadow">{t("categoriesTitle")}</h2>
              <dl className="mt-3 space-y-4">
                <div><dt className="font-semibold">{t("necessaryTitle")}</dt><dd>{t("necessaryText")}</dd></div>
                <div><dt className="font-semibold">{t("analyticsTitle")}</dt><dd>{t("analyticsText")}</dd></div>
                <div><dt className="font-semibold">{t("marketingTitle")}</dt><dd>{t("marketingText")}</dd></div>
                <div><dt className="font-semibold">{t("mediaTitle")}</dt><dd>{t("mediaText")}</dd></div>
              </dl>
            </div>

            <div>
              <h2 className="font-pixel text-sm leading-relaxed text-royal-shadow">{t("storageTitle")}</h2>
              <p className="mt-3">{t("storageText")}</p>
            </div>

            <div>
              <h2 className="font-pixel text-sm leading-relaxed text-royal-shadow">{t("providersTitle")}</h2>
              <p className="mt-3">{t("providersText")}</p>
              <ul className="mt-3 list-disc space-y-1 pl-6">
                {providers.map(({ labelKey, href }) => (
                  <li key={labelKey}><a href={href} target="_blank" rel="noopener noreferrer" className="text-royal-shadow underline">{t(labelKey)}</a></li>
                ))}
                <li><a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-royal-shadow underline">YouTube (Google)</a></li>
              </ul>
            </div>

            <div>
              <h2 className="font-pixel text-sm leading-relaxed text-royal-shadow">{t("rightsTitle")}</h2>
              <p className="mt-3">{t("rightsText")}</p>
            </div>
          </section>
        </article>
      </main>
      <Footer />
    </>
  );
}
