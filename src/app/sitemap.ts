import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { siteUrl } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(routing.locales.map((l) => [l, `${siteUrl}/${l}`]));
  return routing.locales.map((locale) => ({
    url: `${siteUrl}/${locale}`,
    lastModified: new Date(),
    alternates: { languages },
  }));
}
