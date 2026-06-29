import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { routing } from "@/i18n/routing";

const intlMiddleware = createMiddleware(routing);

/**
 * ADS Business Platform
 * ---------------------
 * Global Request Pipeline
 *
 * Responsibilities:
 * 1. Route classification
 * 2. Locale resolution
 * 3. Authentication hand-off (Phase 7)
 * 4. Continue request
 *
 * This file must remain free from:
 * - business logic
 * - repository access
 * - organization resolution
 * - authorization
 * - mutable request state
 */
export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Ignore internal framework and static asset requests.
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Future:
  // Route classification
  //
  // Public Website
  // CRM
  // Admin
  //
  // Authentication will be added in Phase 7.

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    "/",
    "/((?!api|_next|.*\\..*).*)",
  ],
};