import { frontendPortfolioUrl, gamePortfolioUrl } from "@/config/site";

export type FrontendProject = {
  key: "zazastro" | "botbot" | "frontendPortfolio" | "gamePortfolio";
  image: string;
  url?: string;
  tags: string[];
};

export const frontendProjects: FrontendProject[] = [
  {
    key: "zazastro",
    image: "/frontend-projects/zazastro.webp",
    url: "https://zazastro.com.br",
    tags: ["Next.js", "D3.js", "next-intl", "Node.js"],
  },
  {
    key: "botbot",
    image: "/frontend-projects/botbot.webp",
    tags: ["React", "TypeScript", "Tailwind", "ROSLIB"],
  },
  {
    key: "frontendPortfolio",
    image: "/frontend-projects/frontend-portfolio.webp",
    url: frontendPortfolioUrl,
    tags: ["Next.js", "TypeScript", "Tailwind"],
  },
  {
    key: "gamePortfolio",
    image: "/frontend-projects/game-portfolio.webp",
    url: gamePortfolioUrl,
    tags: ["Next.js", "Tailwind", "Unity WebGL"],
  },
];
