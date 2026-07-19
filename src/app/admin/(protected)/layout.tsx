import { headers } from "next/headers";
import { requireAuthenticated } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const requestHeaders = await headers();

  // Skip authentication only during Next.js build/prerender.
  // Real requests always contain a Host header.
  if (requestHeaders.get("host")) {
    await requireAuthenticated();
  }

  return <>{children}</>;
}