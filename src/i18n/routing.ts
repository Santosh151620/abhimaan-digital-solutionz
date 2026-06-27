import {defineRouting} from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "hi", "kn", "mr", "te"],

  defaultLocale: "en",
});