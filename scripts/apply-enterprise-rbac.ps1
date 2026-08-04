# ===========================================================
# ADS Enterprise RBAC Generator
# Batch 1 - Framework
# ===========================================================

Set-StrictMode -Version Latest

$ErrorActionPreference = "Stop"

$Root =
    Split-Path $PSScriptRoot -Parent

Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host " ADS Enterprise RBAC Generator" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

function Ensure-Folder {

    param(
        [string]$Path
    )

    if (!(Test-Path $Path)) {

        New-Item `
            -ItemType Directory `
            -Path $Path `
            -Force | Out-Null

        Write-Host "Created Folder : $Path" -ForegroundColor Green

    }

}

function Write-File {

    param(

        [string]$RelativePath,

        [string]$Content

    )

    $File =
        Join-Path $Root $RelativePath

    $Folder =
        Split-Path $File

    Ensure-Folder $Folder

    Set-Content `
        -Path $File `
        -Encoding UTF8 `
        -Value $Content

    Write-Host "Generated : $RelativePath" -ForegroundColor Yellow

}

$Folders = @(
    "src\shared\permissions",
    "src\types\auth",
    "src\services\auth",
    "src\repositories\admin",
    "src\components\admin\rbac",
    "src\app\admin\rbac",
    "src\lib\auth"
)

foreach ($Folder in $Folders) {

    Ensure-Folder (

        Join-Path $Root $Folder

    )

}

Write-Host ""
Write-Host "Batch 1 Complete" -ForegroundColor Green
Write-Host ""
# ===========================================================
# Batch 2
# Enterprise Permission Files
# ===========================================================

Write-Host ""
Write-Host "Generating Permission Definitions..." -ForegroundColor Cyan
Write-Host ""

Write-File `
"src/shared/permissions/platform.permissions.ts" `
@'
export const PLATFORM_PERMISSIONS = [

  "platform.view",
  "platform.manage",

  "organization.create",
  "organization.delete",

  "billing.manage",

  "audit.view",

] as const;
'@

Write-File `
"src/shared/permissions/admin.permissions.ts" `
@'
export const ADMIN_PERMISSIONS = [

  "users.manage",

  "roles.manage",

  "permissions.manage",

  "settings.manage",

] as const;
'@

Write-File `
"src/shared/permissions/crm.permissions.ts" `
@'
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
  "projects.delete",

] as const;
'@

Write-File `
"src/shared/permissions/index.ts" `
@'
import { PLATFORM_PERMISSIONS } from "./platform.permissions";
import { ADMIN_PERMISSIONS } from "./admin.permissions";
import { CRM_PERMISSIONS } from "./crm.permissions";

export const PERMISSIONS = [

  ...PLATFORM_PERMISSIONS,

  ...ADMIN_PERMISSIONS,

  ...CRM_PERMISSIONS,

] as const;

export type Permission =
    typeof PERMISSIONS[number];

export const PERMISSION_SET =
    new Set<string>(PERMISSIONS);
'@

Write-Host ""
Write-Host "Batch 2 Complete" -ForegroundColor Green
Write-Host ""
# ===========================================================
# Batch 3
# Roles + Hierarchy + Shared Auth Types
# ===========================================================

Write-Host ""
Write-Host "Generating Enterprise Roles..." -ForegroundColor Cyan
Write-Host ""

Write-File `
"src/types/auth/role.ts" `
@'
export type Role =

    | "PLATFORM_OWNER"

    | "PLATFORM_ADMIN"

    | "ORGANIZATION_ADMIN"

    | "DEPARTMENT_ADMIN"

    | "TEAM_LEAD"

    | "USER"

    | "VIEWER";

export interface RoleDefinition {

    id: Role;

    name: string;

    hierarchy: number;

}

export interface UserRole {

    id: string;

    role: Role;

    permissions: readonly string[];

}

export interface AuthorizationContext {

    userId: string;

    organizationId: string;

    role: Role;

    permissions: readonly string[];

}
'@

Write-File `
"src/lib/auth/role-hierarchy.ts" `
@'
import type { Role } from "@/types/auth/role";

export const ROLE_HIERARCHY: Record<Role, number> = {

    PLATFORM_OWNER: 100,

    PLATFORM_ADMIN: 90,

    ORGANIZATION_ADMIN: 80,

    DEPARTMENT_ADMIN: 70,

    TEAM_LEAD: 60,

    USER: 50,

    VIEWER: 10,

};

export function isRoleAtLeast(

    current: Role,

    required: Role,

): boolean {

    return ROLE_HIERARCHY[current] >= ROLE_HIERARCHY[required];

}
'@

Write-Host ""
Write-Host "Batch 3 Complete" -ForegroundColor Green
Write-Host ""
# ===========================================================
# Batch 4
# Enterprise Authorization Engine
# ===========================================================

Write-Host ""
Write-Host "Generating Authorization Engine..." -ForegroundColor Cyan
Write-Host ""

Write-File `
"src/lib/auth/authorization.ts" `
@'
import { PERMISSION_SET } from "@/shared/permissions";
import type {
    Permission,
} from "@/shared/permissions";

import type {
    Role,
} from "@/types/auth/role";

export interface AuthorizationProvider {

    role: Role;

    permissions: readonly Permission[];

}

export function hasPermission(

    authorization: AuthorizationProvider,

    permission: Permission,

): boolean {

    if (

        !PERMISSION_SET.has(permission)

    ) {

        return false;

    }

    return authorization.permissions.includes(permission);

}

export function hasAnyPermission(

    authorization: AuthorizationProvider,

    permissions: readonly Permission[],

): boolean {

    return permissions.some(

        permission =>

            hasPermission(

                authorization,

                permission,

            ),

    );

}

export function hasAllPermissions(

    authorization: AuthorizationProvider,

    permissions: readonly Permission[],

): boolean {

    return permissions.every(

        permission =>

            hasPermission(

                authorization,

                permission,

            ),

    );

}
'@

Write-File `
"src/services/auth/AuthorizationService.ts" `
@'
import {

    hasAllPermissions,

    hasAnyPermission,

    hasPermission,

} from "@/lib/auth/authorization";

import type {

    Permission,

} from "@/shared/permissions";

import type {

    Role,

} from "@/types/auth/role";

export interface AuthorizationRequest {

    role: Role;

    permissions: readonly Permission[];

}

class AuthorizationService {

    can(

        role: Role,

        permission: Permission,

        grantedPermissions: readonly Permission[],

    ): boolean {

        return hasPermission(

            {

                role,

                permissions: grantedPermissions,

            },

            permission,

        );

    }

    canAny(

        role: Role,

        required: readonly Permission[],

        grantedPermissions: readonly Permission[],

    ): boolean {

        return hasAnyPermission(

            {

                role,

                permissions: grantedPermissions,

            },

            required,

        );

    }

    canAll(

        role: Role,

        required: readonly Permission[],

        grantedPermissions: readonly Permission[],

    ): boolean {

        return hasAllPermissions(

            {

                role,

                permissions: grantedPermissions,

            },

            required,

        );

    }

}

export const AuthorizationServiceInstance =
    new AuthorizationService();
'@

Write-Host ""
Write-Host "Batch 4 Complete" -ForegroundColor Green
Write-Host ""
# ===========================================================
# Batch 5
# Enterprise RBAC Repositories
# ===========================================================

Write-Host ""
Write-Host "Generating RBAC Repositories..." -ForegroundColor Cyan
Write-Host ""

Write-File `
"src/repositories/admin/RoleRepository.ts" `
@'
import type {
    Role,
} from "@/types/auth/role";


export interface RoleRecord {

    id: string;

    name: Role;

    description?: string;

    createdAt?: string;

    updatedAt?: string;

}


class RoleRepository {


    async getAll(): Promise<RoleRecord[]> {

        return [];

    }


    async create(

        role: RoleRecord,

    ): Promise<RoleRecord> {

        return role;

    }


    async update(

        id: string,

        data: Partial<RoleRecord>,

    ): Promise<RoleRecord> {

        return {

            id,

            name:
                data.name ?? "USER",

            ...data,

        };

    }


    async delete(

        id: string,

    ): Promise<boolean> {

        return Boolean(id);

    }


}


export const RoleRepositoryInstance =
    new RoleRepository();
'@


Write-File `
"src/repositories/admin/PermissionRepository.ts" `
@'
import {

    PERMISSIONS,

} from "@/shared/permissions";


import type {

    Permission,

} from "@/shared/permissions";


export interface PermissionAssignment {

    role: string;

    permission: Permission;

}



class PermissionRepository {


    async getAll(): Promise<readonly Permission[]> {

        return PERMISSIONS;

    }



    async assign(

        assignment: PermissionAssignment,

    ): Promise<PermissionAssignment> {

        return assignment;

    }



    async remove(

        assignment: PermissionAssignment,

    ): Promise<PermissionAssignment> {

        return assignment;

    }


}



export const PermissionRepositoryInstance =
    new PermissionRepository();
'@


Write-Host ""
Write-Host "Batch 5 Complete" -ForegroundColor Green
Write-Host ""
# ===========================================================
# Batch 6
# Enterprise RBAC Admin UI
# ===========================================================

Write-Host ""
Write-Host "Generating RBAC Admin UI..." -ForegroundColor Cyan
Write-Host ""

Write-File `
"src/components/admin/rbac/RoleTable.tsx" `
@'
"use client";

import type {
    Role,
} from "@/types/auth/role";


const ROLES: Role[] = [

    "PLATFORM_OWNER",

    "PLATFORM_ADMIN",

    "ORGANIZATION_ADMIN",

    "DEPARTMENT_ADMIN",

    "TEAM_LEAD",

    "USER",

    "VIEWER",

];


export default function RoleTable() {


    return (

        <div className="rounded-lg border p-6">

            <h2 className="mb-4 text-lg font-semibold">

                Role Management

            </h2>


            <table className="w-full text-sm">

                <thead>

                    <tr className="border-b">

                        <th className="p-2 text-left">

                            Role

                        </th>

                        <th className="p-2 text-left">

                            Status

                        </th>

                    </tr>

                </thead>


                <tbody>

                    {ROLES.map((role) => (

                        <tr
                            key={role}
                            className="border-b"
                        >

                            <td className="p-2">

                                {role}

                            </td>


                            <td className="p-2">

                                Active

                            </td>


                        </tr>

                    ))}

                </tbody>


            </table>


        </div>

    );

}
'@


Write-File `
"src/app/admin/rbac/page.tsx" `
@'
import RoleTable from "@/components/admin/rbac/RoleTable";


export default function RBACPage() {


    return (

        <main className="p-8">


            <h1 className="mb-6 text-2xl font-bold">

                Enterprise RBAC Management

            </h1>


            <RoleTable />


        </main>

    );

}
'@


Write-Host ""
Write-Host "Batch 6 Complete" -ForegroundColor Green
Write-Host ""
# ===========================================================
# Batch 7
# Enterprise RBAC Generator Hardening
# Validation + Safety + Summary
# ===========================================================

Write-Host ""
Write-Host "Applying RBAC Generator Hardening..." -ForegroundColor Cyan
Write-Host ""


function Test-RequiredFile {

    param(
        [string]$RelativePath
    )

    $File =
        Join-Path $Root $RelativePath


    if (Test-Path $File) {

        Write-Host "Verified : $RelativePath" -ForegroundColor Green

        return $true

    }


    Write-Host "Missing : $RelativePath" -ForegroundColor Red

    return $false

}



$RequiredFiles = @(

    "src/shared/permissions/index.ts",

    "src/shared/permissions/platform.permissions.ts",

    "src/shared/permissions/admin.permissions.ts",

    "src/shared/permissions/crm.permissions.ts",

    "src/types/auth/role.ts",

    "src/lib/auth/role-hierarchy.ts",

    "src/lib/auth/authorization.ts",

    "src/services/auth/AuthorizationService.ts",

    "src/repositories/admin/RoleRepository.ts",

    "src/repositories/admin/PermissionRepository.ts",

    "src/components/admin/rbac/RoleTable.tsx",

    "src/app/admin/rbac/page.tsx"

)



$Failed = @()



foreach ($File in $RequiredFiles) {

    if (!(Test-RequiredFile $File)) {

        $Failed += $File

    }

}



Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host " ADS Enterprise RBAC Status" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan


if ($Failed.Count -eq 0) {


    Write-Host ""
    Write-Host "RBAC Generation Status : SUCCESS" -ForegroundColor Green

    Write-Host ""
    Write-Host "Generated Components:" -ForegroundColor Yellow

    Write-Host " ✓ Enterprise Roles"

    Write-Host " ✓ Permission Registry"

    Write-Host " ✓ Authorization Engine"

    Write-Host " ✓ Role Repository"

    Write-Host " ✓ Permission Repository"

    Write-Host " ✓ Admin RBAC UI"

    Write-Host ""


}
else {


    Write-Host ""

    Write-Host "RBAC Generation Status : FAILED" -ForegroundColor Red


    Write-Host ""

    Write-Host "Missing Files:" -ForegroundColor Yellow


    foreach ($Item in $Failed) {

        Write-Host " - $Item"

    }


    exit 1

}



Write-Host ""
Write-Host "Enterprise RBAC Sprint 1 Files Ready" -ForegroundColor Green
Write-Host ""

