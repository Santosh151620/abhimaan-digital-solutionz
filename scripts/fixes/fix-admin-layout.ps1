$ErrorActionPreference = "Stop"

$Layout = ".\src\app\admin\layout.tsx"

@'
import { requireAuthenticated } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  await requireAuthenticated();

  return <>{children}</>;
}
'@ | Set-Content $Layout

Write-Host ""
Write-Host "Admin layout restored."
Write-Host ""