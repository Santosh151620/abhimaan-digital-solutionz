import { requireAuthenticated } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (process.env.NEXT_PHASE !== "phase-production-build") {
    await requireAuthenticated();
  }

  return <>{children}</>;
}