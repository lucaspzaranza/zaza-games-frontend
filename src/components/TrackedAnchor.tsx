"use client";

import type { AnchorHTMLAttributes } from "react";
import { trackEvent, type DataLayerEvent } from "@/lib/analytics";

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "onClick"> & {
  event: DataLayerEvent;
};

export default function TrackedAnchor({ event, ...anchorProps }: Props) {
  return <a {...anchorProps} onClick={() => trackEvent(event)} />;
}
