import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import LiteYouTube from "./LiteYouTube";
import Logo from "./Logo";
import { demoVideoIds } from "@/data/demos";
import { contactEmail, frontendPortfolioUrl, gamePortfolioUrl, instagramUrl } from "@/config/site";
import { frontendProjects } from "@/data/frontendProjects";
import TrackedAnchor from "./TrackedAnchor";
import CookieSettingsButton from "./CookieSettingsButton";
import Image from "next/image";
import games from "@/data/games.json";

type Item = { title: string; text: string };
type GameItem = Item & { year: string };
const brandName = "Zaza Games";
// Use the real pixel size of the PNG (right click > Properties > Details)
const heroLogo = { src: "/zaza-games-brand-kit-v4/zaza-logo-blue-bg-x10-no-badge.png", width: 640, height: 320 };

const card = "border-4 border-ink bg-white p-5 text-ink shadow-[6px_6px_0_0_#131a33]";
const cardTitle = "mb-3 font-pixel text-xs leading-relaxed text-royal-shadow";
const button = "inline-block border-4 border-ink px-5 py-3 font-pixel text-xs shadow-[4px_4px_0_0_#131a33] transition hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none";

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

function Section({ id, title, tone = "dark", children, spacing = "py-20" }: { id: string; title: string; tone?: keyof typeof tones; children: React.ReactNode; spacing?: string }) {
  return (
    <section id={id} className={`${tones[tone].wrap} px-6 ${spacing}`}>
      <div className="mx-auto max-w-5xl">
        <h2 className={`mb-8 font-pixel text-lg leading-relaxed sm:text-2xl ${tones[tone].heading}`}>{title.endsWith("?") ? title.slice(0, -1) : title}{(title.endsWith("?") || title === "Quem está por trás") && <Image src="/smw-question-block.png" alt="" aria-hidden="true" width={32} height={32} className="ml-1 relative -top-1.5 inline-block size-8 align-middle object-contain"  unoptimized/>}</h2>
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
            className="h-9 w-auto shrink-0"
            unoptimized
          />
          <span
            className={
              brandMini +
              " font-pixel text-[10px] text-white sm:hidden lg:inline lg:text-xs"
            }
          >
            {brandName}
          </span>
        </Link>
        <ul className="hidden gap-5 text-sm sm:flex">
          {links.map((key) => (
            <li key={key}>
              <a href={`/${locale}#${key}`} className="hover:text-gold-glow">
                {t(key)}
              </a>
            </li>
          ))}
        </ul>
        <Link
          href={`/${otherLocale}`}
          hrefLang={otherLocale}
          scroll={false}
          className="border-2 border-ink bg-snow px-3 py-1 font-pixel text-[10px] text-ink shadow-[2px_2px_0_0_#131a33] hover:bg-gold"
        >
          {otherLocale === "pt" ? "PT" : "EN"}
        </Link>
      </nav>
    </header>
  );
}

export function Hero() {
  const t = useTranslations("Hero");
  const proofs = t.raw("proofs") as string[];
  return (
    <section className={`bg-royal px-6 py-10 sm:py-12 md:py-20 ${gamePattern}`}>
      <div className="mx-auto max-w-5xl text-center md:text-left">
        <div>
          <div className="flex items-center justify-center gap-2 md:justify-start md:gap-3">
            <Logo height={144} className="h-20 w-20 shrink-0 md:h-36 md:w-36" />
            <Image
              src={heroLogo.src}
              width={heroLogo.width}
              height={heroLogo.height}
              alt=""
              aria-hidden="true"
              unoptimized
              loading="eager"
              fetchPriority="high"
              className="block h-auto w-40 max-w-full md:w-56"
            />
          </div>
          <p className="mt-4 font-pixel text-[11px] leading-relaxed text-gold-glow sm:text-sm">
            {t("eyebrow")}
          </p>
          <h1 className="mt-3 max-w-3xl text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
            {t("title")}
          </h1>
          <h2 className="mt-5 max-w-2xl text-lg leading-relaxed text-white/90 sm:text-xl">
            {t("subtitle")}
          </h2>
          <div className="mt-6 flex flex-wrap justify-center gap-4 md:justify-start">
            <TrackedAnchor
              href="#contact"
              event={{ event: "cta_click", cta_location: "hero", cta_label: "proposal" }}
              className={`${button} bg-gold text-ink`}
            >
              {t("ctaContact")}
            </TrackedAnchor>
            <TrackedAnchor
              href="#demos"
              event={{ event: "cta_click", cta_location: "hero", cta_label: "demos" }}
              className={`${button} bg-snow text-ink`}
            >
              {t("ctaDemos")}
            </TrackedAnchor>
          </div>
          <ul className="mx-auto mt-6 flex w-fit flex-col items-start gap-y-2 text-sm md:mx-0 md:flex-row md:flex-wrap md:gap-x-5">
            {proofs.map((proof) => (
              <li key={proof} className="flex items-center gap-2">
                <span aria-hidden="true" className="font-bold text-gold-glow">✓</span>
                <span>{proof}</span>
              </li>
            ))}
          </ul>
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
    <Section id="demos" title={t("title")} tone="light" spacing="pt-20 pb-5">
      <p className="mb-10 max-w-3xl text-lg">{t("intro")}</p>
      <div className="grid gap-10 sm:grid-cols-2">
        {items.map((item, index) => (
          <figure key={item.title}>
            <LiteYouTube
              id={demoVideoIds[index]}
              title={item.title}
              playLabel={t("play")}
              closeLabel={t("close")}
              mediaPermissionLabel={t("mediaPermission")}
              portrait={index === 1}
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

function getYouTubeId(url: string) {
  const parsed = new URL(url);
  if (parsed.hostname.endsWith("youtu.be")) return parsed.pathname.slice(1);
  if (parsed.pathname.startsWith("/shorts/")) return parsed.pathname.split("/")[2];
  return parsed.searchParams.get("v") ?? parsed.pathname.split("/").pop() ?? "";
}

export function AllGames() {
  const t = useTranslations("Games");
  const locale = useLocale() as "pt" | "en";

  return (
    <section id="all-games" className="bg-snow px-6 pt-5 pb-20 text-ink">
      <div className="mx-auto max-w-5xl">
        <details className="group/games">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 border-b-4 border-ink pb-5 marker:hidden">
            <span>
              <span className="block font-pixel text-lg leading-relaxed text-royal-shadow sm:text-2xl">{t("title")}</span>
              <span className="mt-3 block text-sm">{t("expand")}</span>
            </span>
            <span aria-hidden="true" className="shrink-0 font-pixel text-2xl text-royal-shadow transition-transform group-open/games:rotate-180">▼</span>
          </summary>
          <div className="grid gap-8 pt-8 sm:grid-cols-2 lg:grid-cols-3">
            {games.map((game) => (
              <article key={game.id} className="overflow-hidden border-4 border-ink bg-white text-ink shadow-[6px_6px_0_0_#131a33]">
                {game.youtube ? (
                  <LiteYouTube
                    id={getYouTubeId(game.youtube)}
                    title={game.name[locale]}
                    playLabel={t("watch")}
                    closeLabel={t("close")}
                    mediaPermissionLabel={t("mediaPermission")}
                    portrait={game.youtube.includes("/shorts/")}
                    thumbnail={game.image}
                    className="border-0 shadow-none"
                  />
                ) : (
                  <div className="relative aspect-video border-b-4 border-ink bg-ink">
                    <Image
                      src={game.image}
                      alt={game.name[locale]}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex flex-wrap items-center justify-between gap-4 p-4">
                  <h3 className="font-pixel text-xs leading-relaxed text-royal-shadow">{game.name[locale]}</h3>
                  {game.demo && (
                    <TrackedAnchor
                      href={game.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      event={{ event: "demo_open", game_name: game.name[locale] }}
                      className="border-2 border-ink bg-royal px-3 py-2 font-pixel text-[10px] text-white shadow-[2px_2px_0_0_#131a33] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
                    >
                      {t("demo")}
                    </TrackedAnchor>
                  )}
                </div>
              </article>
            ))}
          </div>
        </details>
      </div>
    </section>
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
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "");
  const whatsappUrl = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(t("whatsappMessage"))}`
    : undefined;
  return (
    <Section id="contact" title={t("title")} tone="royal">
      <p className="mb-8 max-w-2xl text-lg">{t("text")}</p>
      <div className="flex flex-wrap gap-4">
        {whatsappUrl && (
          <TrackedAnchor
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            event={{ event: "contact_click", contact_method: "whatsapp" }}
            className={`${button} bg-gold text-ink`}
          >
            {t("whatsapp")}
          </TrackedAnchor>
        )}
        <TrackedAnchor
          href={`mailto:${contactEmail}`}
          event={{ event: "contact_click", contact_method: "email" }}
          className={`${button} ${whatsappUrl ? "bg-snow" : "bg-gold"} text-ink`}
        >
          {t("email")}
        </TrackedAnchor>
        <TrackedAnchor
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          event={{ event: "contact_click", contact_method: "instagram" }}
          className={`${button} bg-snow text-ink`}
        >
          {t("instagram")}
        </TrackedAnchor>
      </div>
    </Section>
  );
}

export function Footer() {
  const locale = useLocale();
  const t = useTranslations("CookieConsent");

  return (
    <footer className="border-t-4 border-ink bg-ink px-6 py-6 text-center text-sm text-white/70">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-5 gap-y-2">
        <span>© {new Date().getFullYear()} {brandName}</span>
        <Link href={`/${locale}/privacy`} className="underline decoration-white/50 underline-offset-4 hover:text-gold-glow">
          {t("privacyLink")}
        </Link>
        <CookieSettingsButton label={t("openSettings")} />
      </div>
    </footer>
  );
}
