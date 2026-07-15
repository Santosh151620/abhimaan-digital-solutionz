import { requireAuthenticated } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  await requireAuthenticated();

  return <>{children}</>;
}





