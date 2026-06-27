import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: [
    "/",
    "/(en|hi|kn|mr|te)/:path*",
    "/((?!api|_next|.*\\..*).*)",
  ],
};