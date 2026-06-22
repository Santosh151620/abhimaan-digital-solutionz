import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  // This activates Turbopack support for next-intl JSON asset mapping
  turbopack: {},
  experimental: {
    optimizePackageImports: ["@tailwindcss/postcss"],
  },
};

export default withNextIntl(nextConfig);
