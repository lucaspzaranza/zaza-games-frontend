import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/ig",
        destination:
          "/pt?utm_source=instagram&utm_medium=bio&utm_content=link_in_bio&utm_campaign=profile",
        permanent: false,
      },
      {
        source: "/story",
        destination:
          "/pt?utm_source=instagram&utm_medium=story&utm_content=link_in_bio&utm_campaign=profile",
        permanent: false,
      },
      {
        source: "/post",
        destination:
          "/pt?utm_source=instagram&utm_medium=post&utm_content=pinned_post&utm_campaign=profile",
        permanent: false,
      },
      {
        source: "/wpp-group",
        destination:
          "/pt?utm_source=whatsapp&utm_medium=wpp_group&utm_content=wpp&utm_campaign=profile",
        permanent: false,
      },
      {
        source: "/wpp-private",
        destination:
          "/pt?utm_source=whatsapp&utm_medium=wpp_private&utm_content=wpp&utm_campaign=profile",
        permanent: false,
      },
    ];
  },
};

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

export default withNextIntl(nextConfig);
