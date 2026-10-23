import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { siteUrl } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["", "/privacy"];

  return paths.flatMap((path) => {
    const languages = {
      "pt-BR": `${siteUrl}/pt${path}`,
      en: `${siteUrl}/en${path}`,
      "x-default": `${siteUrl}/pt${path}`,
    };

    return routing.locales.map((locale) => ({
      url: `${siteUrl}/${locale}${path}`,
      lastModified: new Date(),
      alternates: { languages },
    }));
  });
}
