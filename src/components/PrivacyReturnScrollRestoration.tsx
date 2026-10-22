"use client";

import { useEffect, useRef } from "react";
import { useLocale } from "next-intl";
import { usePathname } from "next/navigation";

const SCROLL_POSITION_KEY = "zaza-home-scroll-before-privacy-v1";

export default function PrivacyReturnScrollRestoration() {
  const locale = useLocale();
  const pathname = usePathname();
  const previousPathname = useRef(pathname);
  const homePath = `/${locale}`;
  const privacyPath = `${homePath}/privacy`;

  useEffect(() => {
    const rememberPosition = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      const link = event.target.closest<HTMLAnchorElement>("a[href]");
      if (!link) return;

      const destination = new URL(link.href, window.location.href);
      if (window.location.pathname === homePath && destination.pathname === privacyPath) {
        try {
          window.sessionStorage.setItem(SCROLL_POSITION_KEY, String(window.scrollY));
        } catch {
          // Keep the browser's built-in history restoration if session storage is unavailable.
        }
      } else if (window.location.pathname === privacyPath && destination.pathname === homePath && destination.hash) {
        try {
          window.sessionStorage.removeItem(SCROLL_POSITION_KEY);
        } catch {
          // An explicit section link should still use the browser's normal anchor behavior.
        }
      }
    };

    document.addEventListener("click", rememberPosition, true);
    return () => document.removeEventListener("click", rememberPosition, true);
  }, [homePath, privacyPath]);

  useEffect(() => {
    const returnedFromPrivacy = previousPathname.current === privacyPath && pathname === homePath;
    previousPathname.current = pathname;

    if (!returnedFromPrivacy) return;

    let savedPosition: string | null;
    try {
      savedPosition = window.sessionStorage.getItem(SCROLL_POSITION_KEY);
    } catch {
      return;
    }
    if (savedPosition === null) return;

    try {
      window.sessionStorage.removeItem(SCROLL_POSITION_KEY);
    } catch {
      // The in-memory value below is still enough to restore this visit.
    }
    const top = Number(savedPosition);
    if (!Number.isFinite(top)) return;

    // Let Next.js finish its own history scroll handling before restoring the saved spot.
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => window.scrollTo({ top, behavior: "auto" }));
    });
  }, [homePath, pathname, privacyPath]);

  return null;
}
