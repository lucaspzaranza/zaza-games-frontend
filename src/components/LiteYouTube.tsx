"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { trackEvent } from "@/lib/analytics";
import { CONSENT_SETTINGS_OPEN_EVENT } from "@/lib/consent";
import { useCookieConsent } from "@/hooks/useCookieConsent";

type YouTubePlayer = {
  destroy: () => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  playVideo: () => void;
};

type YouTubePlayerState = { data: number };
type YouTubePlayerReady = { target: YouTubePlayer };

type YouTubeApi = {
  Player: new (
    element: HTMLElement,
    options: {
      events: {
        onReady: (event: YouTubePlayerReady) => void;
        onStateChange: (event: YouTubePlayerState) => void;
      };
    },
  ) => YouTubePlayer;
};

declare global {
  interface Window {
    YT?: YouTubeApi;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let youtubeApiPromise: Promise<void> | undefined;

function loadYouTubeIframeApi() {
  if (window.YT?.Player) return Promise.resolve();
  if (youtubeApiPromise) return youtubeApiPromise;

  youtubeApiPromise = new Promise<void>((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[src="https://www.youtube.com/iframe_api"]',
    );
    const previousCallback = window.onYouTubeIframeAPIReady;

    window.onYouTubeIframeAPIReady = () => {
      previousCallback?.();
      resolve();
    };

    if (existingScript) {
      existingScript.addEventListener("error", () => reject(new Error("YouTube API failed to load.")), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;
    script.onerror = () => reject(new Error("YouTube API failed to load."));
    document.head.appendChild(script);
  });

  return youtubeApiPromise;
}

type Props = {
  id: string;
  mobileId?: string;
  title: string;
  playLabel: string;
  closeLabel: string;
  mediaPermissionLabel: string;
  className?: string;
  thumbnail?: string;
  portrait?: boolean;
  squarePreviewOnMobile?: boolean;
};

export default function LiteYouTube({
  id,
  mobileId,
  title,
  playLabel,
  closeLabel,
  mediaPermissionLabel,
  className = "",
  thumbnail,
  portrait = false,
  squarePreviewOnMobile = false,
}: Props) {
  const consent = useCookieConsent();
  const mediaAllowed = consent?.externalMedia === true;
  const localThumbnail = thumbnail?.startsWith("/") ?? false;
  const [active, setActive] = useState(false);
  const [apiFailed, setApiFailed] = useState(false);
  const [playerOrigin, setPlayerOrigin] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const activeId = isMobile && mobileId ? mobileId : id;
  const isPortrait = mobileId ? isMobile : portrait;
  const squarePreview = squarePreviewOnMobile && isMobile;
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const playerRef = useRef<HTMLIFrameElement>(null);
  const watchedProgressRef = useRef(new Set<number>());

  useEffect(() => {
    if (!mobileId) return;
    const media = window.matchMedia("(max-width: 639px)");
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [mobileId]);

  useEffect(() => {
    if (!active) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActive(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      triggerRef.current?.focus();
    };
  }, [active]);

  useEffect(() => {
    if (!mediaAllowed) setActive(false);
  }, [mediaAllowed]);

  useEffect(() => {
    if (!active || apiFailed) return;

    let cancelled = false;
    let player: YouTubePlayer | undefined;
    let progressInterval: number | undefined;
    let started = false;
    watchedProgressRef.current = new Set<number>();

    const trackProgress = (finished = false) => {
      if (!player) return;
      const duration = player.getDuration();
      const percent = finished
        ? 100
        : duration > 0
          ? (player.getCurrentTime() / duration) * 100
          : 0;

      for (const mark of [25, 50, 75, 100]) {
        if (percent >= mark && !watchedProgressRef.current.has(mark)) {
          watchedProgressRef.current.add(mark);
          trackEvent({ event: "video_progress", game_name: title, percent: mark });
        }
      }
    };

    void loadYouTubeIframeApi()
      .then(() => {
        if (cancelled || !playerRef.current || !window.YT) return;

        player = new window.YT.Player(playerRef.current, {
          events: {
            onReady: (event) => event.target.playVideo(),
            onStateChange: (event) => {
              if (event.data === 1) {
                if (!started) {
                  started = true;
                  trackEvent({ event: "video_start", game_name: title });
                }
                if (progressInterval === undefined) {
                  progressInterval = window.setInterval(() => trackProgress(), 1000);
                }
              } else {
                if (progressInterval !== undefined) {
                  window.clearInterval(progressInterval);
                  progressInterval = undefined;
                }
                if (event.data === 0) trackProgress(true);
              }
            },
          },
        });
      })
      .catch(() => {
        if (!cancelled) setApiFailed(true);
      });

    return () => {
      cancelled = true;
      if (progressInterval !== undefined) window.clearInterval(progressInterval);
      player?.destroy();
    };
  }, [active, activeId, apiFailed, title]);

  const playerSize = isPortrait
    ? "aspect-[9/16] h-[min(70svh,720px)] max-w-[80vw]"
    : "aspect-video w-[min(92vw,1280px)] max-h-[85svh]";

  return (
    <>
      <div className={`relative ${squarePreview ? "aspect-square" : isPortrait ? "aspect-[9/16]" : "aspect-video"} overflow-hidden border-4 border-ink bg-ink shadow-[6px_6px_0_0_#131a33] ${className}`}>
        <button
          ref={triggerRef}
          type="button"
          onClick={() => {
            if (!mediaAllowed) {
              window.dispatchEvent(new Event(CONSENT_SETTINGS_OPEN_EVENT));
              return;
            }
            setApiFailed(false);
            setPlayerOrigin(window.location.origin);
            setActive(true);
            trackEvent({ event: "demo_open", game_name: title });
          }}
          aria-label={`${mediaAllowed ? playLabel : mediaPermissionLabel}: ${title}`}
          className="group absolute inset-0 h-full w-full"
        >
          {thumbnail && (mediaAllowed || localThumbnail) ? (
            <Image
              src={thumbnail}
              alt=""
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover"
            />
          ) : mediaAllowed ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://i.ytimg.com/vi/${activeId}/hqdefault.jpg`}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </>
          ) : null}
          {!mediaAllowed && (
            <span className="absolute inset-0 grid place-items-center bg-royal p-4 text-center text-sm font-semibold leading-relaxed text-white">
              {mediaPermissionLabel}
            </span>
          )}
          {mediaAllowed && (
            <span className="absolute inset-0 grid place-items-center bg-ink/40 font-pixel text-3xl text-gold transition group-hover:bg-ink/10">
              ▶
            </span>
          )}
        </button>
      </div>

      {active && (
        <div
          className="fixed inset-0 z-100 grid place-items-center bg-black/90 p-4 sm:p-8"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setActive(false);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className={`relative overflow-hidden border-2 border-white/30 bg-black shadow-2xl ${playerSize}`}
          >
            <button
              ref={closeRef}
              type="button"
              onClick={() => setActive(false)}
              aria-label={closeLabel}
              className="absolute right-2 top-2 z-10 grid size-10 place-items-center border-2 border-white bg-black/80 font-sans text-3xl leading-none text-white hover:bg-white hover:text-black focus-visible:outline-2 focus-visible:outline-gold"
            >
              ×
            </button>
            <iframe
              ref={playerRef}
              className="absolute inset-0 h-full w-full"
              src={`https://www.youtube-nocookie.com/embed/${activeId}?enablejsapi=1&playsinline=1${playerOrigin ? `&origin=${encodeURIComponent(playerOrigin)}` : ""}${apiFailed ? "&autoplay=1" : ""}`}
              title={title}
              allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </>
  );
}
