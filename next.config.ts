import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

// Specify the custom path to your i18n configuration file here
const withNextIntl = createNextIntlPlugin('./src/i18n/routing.ts');

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react', '@heroicons/react', 'recharts'],
  },
};

export default withNextIntl(nextConfig);