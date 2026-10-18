"use client";
import { useState } from "react";

type Props = { id: string; title: string; playLabel: string };

export default function LiteYouTube({ id, title, playLabel }: Props) {
  const [active, setActive] = useState(false);

  return (
    <div className="relative aspect-video overflow-hidden border-4 border-ink bg-ink shadow-[6px_6px_0_0_#131a33]">
      {active ? (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1`}
          title={title}
          allow="autoplay; encrypted-media; fullscreen"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setActive(true)}
          aria-label={`${playLabel}: ${title}`}
          className="group absolute inset-0 h-full w-full"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover"
          />
          <span className="absolute inset-0 grid place-items-center bg-ink/40 font-pixel text-3xl text-gold transition group-hover:bg-ink/10">
            ▶
          </span>
        </button>
      )}
    </div>
  );
}
