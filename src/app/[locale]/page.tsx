import { setRequestLocale } from "next-intl/server";
import {
  About, Contact, Demos, Footer, FrontendProjects, Gamification, Header, Hero, Offer,
} from "@/components/sections";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Header />
      <main>
        <Hero />
        <Gamification />
        <Offer />
        <Demos />
        <FrontendProjects />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
