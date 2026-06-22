import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

interface SEOProps {
  title: string;
  description: string;
  path?: string;
}

export function generateSEO({
  title,
  description,
  path = "",
}: SEOProps): Metadata {
  const url = `${siteConfig.url}${path}`;

  return {
    title,
    description,

    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      locale: "en_IN",
      type: "website",
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}