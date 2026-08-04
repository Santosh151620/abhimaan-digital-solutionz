# =====================================================
# ADS Enterprise RBAC Generator
# PowerShell 5.1 Compatible
# =====================================================

$Root = "src"

# -----------------------------------------------------
# Folders
# -----------------------------------------------------

$Folders = @(
    "$Root/shared/permissions",
    "$Root/lib/auth",
    "$Root/types/auth",
    "$Root/services/auth",
    "$Root/repositories/admin",
    "$Root/app/admin/rbac",
    "$Root/components/admin/rbac"
)

foreach ($Folder in $Folders) {
    if (!(Test-Path $Folder)) {
        New-Item -ItemType Directory -Path $Folder -Force | Out-Null
        Write-Host "Created: $Folder"
    }
}

# -----------------------------------------------------
# Files
# -----------------------------------------------------

$Files = @{

"$Root/shared/permissions/platform.permissions.ts" = @'
export const PLATFORM_PERMISSIONS = [
  "platform.view",
  "platform.manage",
  "organization.create",
  "organization.delete",
  "billing.manage",
  "audit.view"
] as const;
'@

"$Root/shared/permissions/crm.permissions.ts" = @'
export const CRM_PERMISSIONS = [
  "leads.view",
  "leads.create",
  "leads.update",
  "leads.delete",

  "companies.view",
  "companies.create",
  "companies.update",
  "companies.delete",

  "contacts.view",
  "contacts.create",
  "contacts.update",
  "contacts.delete",

  "projects.view",
  "projects.create",
  "projects.update",
  "projects.delete"
] as const;
'@

"$Root/shared/permissions/admin.permissions.ts" = @'
export const ADMIN_PERMISSIONS = [
  "users.manage",
  "roles.manage",
  "permissions.manage",
  "settings.manage"
] as const;
'@

"$Root/shared/permissions/index.ts" = @'
import { PLATFORM_PERMISSIONS } from './platform.permissions';
import { CRM_PERMISSIONS } from './crm.permissions';
import { ADMIN_PERMISSIONS } from './admin.permissions';

export const PERMISSIONS = [
  ...PLATFORM_PERMISSIONS,
  ...CRM_PERMISSIONS,
  ...ADMIN_PERMISSIONS
] as const;

export type Permission =
    typeof PERMISSIONS[number];
'@

"$Root/types/auth/role.ts" = @'
export type Role =
    | "PLATFORM_OWNER"
    | "PLATFORM_ADMIN"
    | "ORGANIZATION_ADMIN"
    | "DEPARTMENT_ADMIN"
    | "TEAM_LEAD"
    | "USER"
    | "VIEWER";
'@

"$Root/lib/auth/role-hierarchy.ts" = @'
import { Role } from '@/types/auth/role';

export const ROLE_HIERARCHY: Record<Role, number> = {
    PLATFORM_OWNER: 100,
    PLATFORM_ADMIN: 90,
    ORGANIZATION_ADMIN: 80,
    DEPARTMENT_ADMIN: 70,
    TEAM_LEAD: 60,
    USER: 50,
    VIEWER: 10,
};
'@

"$Root/lib/auth/authorization.ts" = @'
import { Permission } from '@/shared/permissions';

export function can(
    permissions: Permission[],
    permission: Permission
) {
    return permissions.includes(permission);
}
'@

"$Root/repositories/admin/RoleRepository.ts" = @'
export class RoleRepository {

    async getAll() {}

    async create() {}

    async update() {}

    async delete() {}
}
'@

"$Root/repositories/admin/PermissionRepository.ts" = @'
export class PermissionRepository {

    async getAll() {}

    async assign() {}

    async remove() {}
}
'@

"$Root/services/auth/AuthorizationService.ts" = @'
export class AuthorizationService {

    can() {}

    canAny() {}

    canAll() {}
}

export const AuthorizationServiceInstance =
    new AuthorizationService();
'@

"$Root/app/admin/rbac/page.tsx" = @'
export default function RBACPage() {
    return <div>RBAC Management</div>;
}
'@

"$Root/components/admin/rbac/RoleTable.tsx" = @'
export default function RoleTable() {
    return <div>Role Table</div>;
}
'@
}

foreach ($File in $Files.Keys) {

    $Folder = Split-Path $File

    if (!(Test-Path $Folder)) {
        New-Item -ItemType Directory -Path $Folder -Force | Out-Null
    }

    $Files[$File] | Set-Content $File -Encoding UTF8

    Write-Host "Created: $File"
}

Write-Host ""
Write-Host "====================================="
Write-Host "ADS Enterprise RBAC Generated"
Write-Host "====================================="