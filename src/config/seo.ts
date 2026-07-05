import { siteConfig } from "./site";

export const seoConfig = {
  defaultTitle:
    siteConfig.name,

  titleTemplate:
    `%s | ${siteConfig.name}`,

  description:
    siteConfig.description,

  openGraph: {
    type: "website",

    locale: "en_IN",

    siteName:
      siteConfig.name,
  },
};

