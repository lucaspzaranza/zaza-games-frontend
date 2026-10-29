export const siteUrl = "https://zazagames.com.br";
// export const siteUrl = "https://zaza-games-frontend.vercel.app";
export const instagramUrl = "https://www.instagram.com/zazagames.studio";
export const gamePortfolioUrl = "https://my-game-portfolio-next.vercel.app";
// export const frontendPortfolioUrl = "https://www.lucaszaranza.com.br/";
export const frontendPortfolioUrl =
  "https://lucasz-n1ripx8xn-lucaspzaranzas-projects.vercel.app/";
export const contactEmail = "lucaszaranza@gmail.com";
export const contactWhatsAppNumber =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "5585991753445";

/*
Quando o domínio estiver pronto
Volte o valor para https://zazagames.com.br depois de registrá-lo e ligá-lo ao projeto na Vercel. 
Se preferir não lembrar disso, dá para deixar automático com variáveis de ambiente da Vercel:

ts
const productionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (productionHost ? `https://${productionHost}` : "http://localhost:3000");
*/
