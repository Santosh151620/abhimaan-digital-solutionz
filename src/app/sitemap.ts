import type { MetadataRoute }
from "next";

import { siteConfig }
from "@/config/site";

export default function sitemap():
MetadataRoute.Sitemap {
  return [
    {
      url:
        siteConfig.url,

      priority: 1,
    },

    {
      url:
        `${siteConfig.url}/about`,

      priority: 0.9,
    },

    {
      url:
        `${siteConfig.url}/services`,

      priority: 0.9,
    },

    {
      url:
        `${siteConfig.url}/industries`,

      priority: 0.8,
    },

    {
      url:
        `${siteConfig.url}/contact`,

      priority: 0.8,
    },

    {
      url:
        `${siteConfig.url}/faq`,

      priority: 0.7,
    },

    {
      url:
        `${siteConfig.url}/testimonials`,

      priority: 0.7,
    },
  ];
}