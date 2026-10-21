"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

type Props = {
  id: string;
  title: string;
  playLabel: string;
  closeLabel: string;
  className?: string;
  thumbnail?: string;
  portrait?: boolean;
};

export default function LiteYouTube({
  id,
  title,
  playLabel,
  closeLabel,
  className = "",
  thumbnail,
  portrait = false,
}: Props) {
  const [active, setActive] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

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

  const playerSize = portrait
    ? "aspect-[9/16] h-[min(85svh,800px)] max-w-[90vw]"
    : "aspect-video w-[min(92vw,1280px)] max-h-[85svh]";

  return (
    <>
      <div className={`relative aspect-video overflow-hidden border-4 border-ink bg-ink shadow-[6px_6px_0_0_#131a33] ${className}`}>
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setActive(true)}
          aria-label={`${playLabel}: ${title}`}
          className="group absolute inset-0 h-full w-full"
        >
          {thumbnail ? (
            <Image
              src={thumbnail}
              alt=""
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover"
            />
          ) : (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </>
          )}
          <span className="absolute inset-0 grid place-items-center bg-ink/40 font-pixel text-3xl text-gold transition group-hover:bg-ink/10">
            ▶
          </span>
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
              className="absolute inset-0 h-full w-full"
              src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1`}
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