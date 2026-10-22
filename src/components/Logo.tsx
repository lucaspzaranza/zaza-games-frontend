import Image from "next/image";

// Copy zaza-badge-white-x20.png from the brand kit to /public.
export default function Logo({ height = 48, className = "" }: { height?: number; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <Image
      src="/zaza-games-brand-kit-v4/zaza-badge-white-x20.png"
      alt="Zaza Games"
      width={height}
      height={height}
      className={className}
      unoptimized
    />
  );
}
