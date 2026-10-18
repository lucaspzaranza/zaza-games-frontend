import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import LiteYouTube from "./LiteYouTube";
import Logo from "./Logo";
import { demoVideoIds } from "@/data/demos";
import { contactEmail, frontendPortfolioUrl, gamePortfolioUrl, instagramUrl } from "@/config/site";
import { frontendProjects } from "@/data/frontendProjects";
import Image from "next/image";

type Item = { title: string; text: string };
type GameItem = Item & { year: string };
const brandName = "Zaza Games";
// "logo" = pixel art logo, "text" = Press Start 2P title with the JRPG gradient
const heroBrand: "logo" | "text" = "logo";
// Use the real pixel size of the PNG (right click > Properties > Details)
const heroLogo = { src: "/zaza-games-brand-kit-v4/zaza-logo-blue-bg-x10-no-badge.png", width: 640, height: 320 };

const card = "border-4 border-ink bg-white p-5 text-ink shadow-[6px_6px_0_0_#131a33]";
const cardTitle = "mb-3 font-pixel text-xs leading-relaxed text-royal-shadow";
const button = "inline-block border-4 border-ink px-5 py-3 font-pixel text-xs shadow-[4px_4px_0_0_#131a33] transition hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none";

const brandTitle =
  "block max-w-[760px] text-[clamp(30px,5vw,56px)] leading-[1.55] tracking-[-1.7px] max-[640px]:text-[clamp(22px,7vw,34px)] " +
  "bg-[linear-gradient(180deg,#fff_0%,#e4ecff_55%,#c4d4ff_100%)] bg-clip-text text-transparent [-webkit-text-fill-color:transparent] " +
  "[filter:drop-shadow(1px_0_0_#0a1050)_drop-shadow(-1px_0_0_#0a1050)_drop-shadow(0_1px_0_#0a1050)_drop-shadow(0_-1px_0_#0a1050)_drop-shadow(3px_4px_0_#000018)]";

const brandMini =
  "bg-[linear-gradient(180deg,#fff_0%,#e4ecff_55%,#c4d4ff_100%)] bg-clip-text text-transparent [-webkit-text-fill-color:transparent] " +
  "[filter:drop-shadow(1px_0_0_#0a1050)_drop-shadow(-1px_0_0_#0a1050)_drop-shadow(0_1px_0_#0a1050)_drop-shadow(0_-1px_0_#0a1050)]";

const gamePattern =
    "bg-[url('/patterns/games-tile.svg')] bg-[length:128px_128px]";

const tones = {
  light: { wrap: "bg-snow text-ink", heading: "text-royal-shadow" },
  royal: {
    wrap: `bg-royal text-white ${gamePattern}`,
    heading: "text-gold-glow",
  },
  dark: { wrap: "bg-ink text-white", heading: "text-gold" },
  soft: { wrap: "bg-snow-shadow text-ink", heading: "text-royal-shadow" },
  white: { wrap: "bg-white text-ink", heading: "text-royal-shadow" },
  sky: { wrap: "bg-snow-shadow text-ink", heading: "text-ink" },
} as const;

function Section({ id, title, tone = "dark", children }: { id: string; title: string; tone?: keyof typeof tones; children: React.ReactNode }) {
  return (
    <section id={id} className={`${tones[tone].wrap} px-6 py-20`}>
      <div className="mx-auto max-w-5xl">
        <h2 className={`mb-8 font-pixel text-lg leading-relaxed sm:text-2xl ${tones[tone].heading}`}>{title}</h2>
        {children}
      </div>
    </section>
  );
}

export function Header() {
  const t = useTranslations("Nav");
  const locale = useLocale();
  const otherLocale = locale === "pt" ? "en" : "pt";
  const links = [
    "gamification",
    "offer",
    "demos",
    "frontend",
    "about",
    "contact",
  ] as const;

  return (
    <header className="sticky top-0 z-10 border-b-4 border-ink bg-royal-shadow/95 backdrop-blur">
      <nav className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-3">
        <Link
          href={`/${locale}`}
          aria-label={brandName}
          className="flex items-center gap-3"
        >
          <Image
            src="/zaza-games-brand-kit-v4/gold-z.png"
            alt="Zaza Games"
            width={28}
            height={36}
            unoptimized
          />
          <span className={brandMini + " font-pixel text-[10px] text-white sm:hidden lg:inline lg:text-xs"}>
            {brandName}
          </span>
        </Link>
        <ul className="hidden gap-5 text-sm sm:flex">
          {links.map((key) => (
            <li key={key}>
              <a href={`#${key}`} className="hover:text-gold-glow">
                {t(key)}
              </a>
            </li>
          ))}
        </ul>
        <Link
          href={`/${otherLocale}`}
          hrefLang={otherLocale}
          className="border-2 border-ink bg-snow px-3 py-1 font-pixel text-[10px] text-ink shadow-[2px_2px_0_0_#131a33] hover:bg-gold"
        >
          {otherLocale.toUpperCase()}
        </Link>
      </nav>
    </header>
  );
}

// export function Hero() {
//   const t = useTranslations("Hero");
//   return (
//     <section className={`bg-royal px-6 py-24 ${gamePattern}`}>
//       <div className="mx-auto flex max-w-5xl flex-col items-center gap-10 text-center md:flex-row md:text-left">
//         <Logo height={160} />
//         <div>
//           <h1 className="font-pixel">
//             <span className={brandTitle}>{brandName}</span>
//             <span className="mt-1 block text-sm text-gold-glow sm:text-xl">
//               {t("title")}
//             </span>
//           </h1>
//           <p className="mt-6 max-w-xl text-lg">{t("subtitle")}</p>
//           <div className="mt-8 flex flex-wrap justify-center gap-4 md:justify-start">
//             <a href="#demos" className={`${button} bg-gold text-ink`}>
//               {t("ctaDemos")}
//             </a>
//             <a href="#contact" className={`${button} bg-snow text-ink`}>
//               {t("ctaContact")}
//             </a>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

export function Hero() {
  const t = useTranslations("Hero");
  return (
    <section className={`bg-royal px-6 py-24 ${gamePattern}`}>
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-10 text-center md:flex-row md:text-left">
        <Logo height={160} />
        <div>
          <h1 className="font-pixel">
            {heroBrand === "logo" ? (
              <Image
                src={heroLogo.src}
                width={heroLogo.width}
                height={heroLogo.height}
                alt={brandName}
                unoptimized
                loading="eager"
                fetchPriority="high"
                className="mx-auto block h-auto w-[420px] max-w-full md:mx-0"
                // style={{ imageRendering: "pixelated" }}
              />
            ) : (
              <span className={brandTitle}>{brandName}</span>
            )}
            <span className="mt-1 block text-sm text-gold-glow sm:text-xl">
              {t("title")}
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-lg">{t("subtitle")}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4 md:justify-start">
            <a href="#demos" className={`${button} bg-gold text-ink`}>
              {t("ctaDemos")}
            </a>
            <a href="#contact" className={`${button} bg-snow text-ink`}>
              {t("ctaContact")}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Gamification() {
  const t = useTranslations("Gamification");
  const items = t.raw("items") as Item[];
  return (
    <Section id="gamification" title={t("title")} tone="light">
      <p className="mb-10 max-w-3xl text-lg">{t("intro")}</p>
      <div className="grid gap-6 sm:grid-cols-2">
        {items.map((item) => (
          <article key={item.title} className={card}>
            <h3 className={cardTitle}>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        ))}
      </div>
    </Section>
  );
}

export function Offer() {
  const t = useTranslations("Offer");
  const items = t.raw("items") as Item[];
  return (
    <Section id="offer" title={t("title")} tone="royal">
      <div className="grid gap-6 md:grid-cols-3">
        {items.map((item) => (
          <article key={item.title} className={card}>
            <h3 className={cardTitle}>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        ))}
      </div>
    </Section>
  );
}

export function Demos() {
  const t = useTranslations("Demos");
  const items = t.raw("items") as Item[];
  return (
    <Section id="demos" title={t("title")} tone="light">
      <p className="mb-10 max-w-3xl text-lg">{t("intro")}</p>
      <div className="grid gap-10 sm:grid-cols-2">
        {items.map((item, index) => (
          <figure key={item.title}>
            <LiteYouTube
              id={demoVideoIds[index]}
              title={item.title}
              playLabel={t("play")}
            />
            <figcaption className="mt-4">
              <h3 className="font-pixel text-xs leading-relaxed text-royal-shadow">
                {item.title}
              </h3>
              <p className="mt-1">{item.text}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </Section>
  );
}

export function FrontendProjects() {
  const t = useTranslations("Frontend");
  return (
    <Section id="frontend" title={t("title")} tone="sky">
      <p className="mb-10 max-w-3xl text-lg">{t("intro")}</p>
      <div className="grid gap-8 sm:grid-cols-2">
        {frontendProjects.map((project) => (
          <article
            key={project.key}
            className="overflow-hidden border-4 border-ink bg-white text-ink shadow-[6px_6px_0_0_#131a33]"
          >
            <div className="relative aspect-video border-b-4 border-ink bg-ink">
              <Image
                src={project.image}
                alt={t(`items.${project.key}.title`)}
                fill
                sizes="(min-width: 640px) 50vw, 100vw"
                className="object-cover object-top"
              />
            </div>
            <div className="p-5">
              <h3 className={cardTitle}>{t(`items.${project.key}.title`)}</h3>
              <p className="mb-4 text-sm">{t(`items.${project.key}.text`)}</p>
              <ul className="mb-4 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <li
                    key={tag}
                    className="border-2 border-ink bg-snow px-2 py-0.5 text-xs"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
              {project.url && (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-royal-shadow underline"
                >
                  {t("visit")} →
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}

export function About() {
  const t = useTranslations("About");
  const games = t.raw("games") as GameItem[];
  const front = t.raw("front") as Item[];
  return (
    <Section id="about" title={t("title")} tone="light">
      <p className="mb-12 max-w-3xl text-lg">{t("intro")}</p>
      <div className="grid gap-12 md:grid-cols-2">
        <div>
          <h3 className="mb-6 font-pixel text-sm leading-relaxed text-royal-shadow">
            {t("gamesTitle")}
          </h3>
          <ol className="space-y-5 border-l-4 border-royal pl-5">
            {games.map((game) => (
              <li key={game.title}>
                <span className="font-pixel text-[10px] text-royal-shadow">
                  {game.year}
                </span>
                <h4 className="font-semibold">{game.title}</h4>
                <p className="text-sm text-ink/80">{game.text}</p>
              </li>
            ))}
          </ol>
          <a
            href={gamePortfolioUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-block text-royal-shadow underline"
          >
            {t("gamesLink")}
          </a>
        </div>
        <div>
          <h3 className="mb-6 font-pixel text-sm leading-relaxed text-royal-shadow">
            {t("frontTitle")}
          </h3>
          <ul className="space-y-4">
            {front.map((project) => (
              <li key={project.title} className={card}>
                <h4 className="font-semibold">{project.title}</h4>
                <p className="text-sm">{project.text}</p>
              </li>
            ))}
          </ul>
          <a
            href={frontendPortfolioUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-block text-royal-shadow underline"
          >
            {t("frontendLink")}
          </a>
        </div>
      </div>
    </Section>
  );
}

export function Contact() {
  const t = useTranslations("Contact");
  return (
    <Section id="contact" title={t("title")} tone="royal">
      <p className="mb-8 max-w-2xl text-lg">{t("text")}</p>
      <div className="flex flex-wrap gap-4">
        <a href={`mailto:${contactEmail}`} className={`${button} bg-gold text-ink`}>{t("email")}</a>
        <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className={`${button} bg-snow text-ink`}>{t("instagram")}</a>
      </div>
    </Section>
  );
}

export function Footer() {
  return (
    <footer className="border-t-4 border-ink bg-ink px-6 py-6 text-center text-sm text-white/70">
      © {new Date().getFullYear()} {brandName}
    </footer>
  );
}
