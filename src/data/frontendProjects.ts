import { frontendPortfolioUrl, gamePortfolioUrl } from "@/config/site";

export type FrontendProject = {
  key: "zazastro" | "botbot" | "frontendPortfolio" | "gamePortfolio";
  image: string;
  url?: string;
};

export const frontendProjects: FrontendProject[] = [
  {
    key: "zazastro",
    image: "/frontend-projects/zazastro.webp",
    url: "https://zazastro.com.br",
  },
  {
    key: "botbot",
    image: "/frontend-projects/botbot.webp",
  },
  {
    key: "frontendPortfolio",
    image: "/frontend-projects/frontend-portfolio.webp",
    url: frontendPortfolioUrl,
  },
  {
    key: "gamePortfolio",
    image: "/frontend-projects/game-portfolio-2.webp",
    url: gamePortfolioUrl,
  },
];
