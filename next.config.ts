import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  /* Suas outras configurações normais do Next.js aqui, se houver */ async redirects() {
    return [
      {
        source: "/ig",
        destination:
          "/pt?utm_source=instagram&utm_medium=bio&utm_campaign=profile",
        permanent: false,
      },
    ];
  },
};

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

export default withNextIntl(nextConfig);
