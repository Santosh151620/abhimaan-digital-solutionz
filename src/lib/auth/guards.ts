import type { AuthUser } from "./user";

import { requireUser } from "./user";

export async function requireAuthenticated(): Promise<AuthUser> {
  return requireUser();
}

export async function requireOrganization(): Promise<AuthUser> {
  return requireUser();
}

export async function requireRole(
  roles: readonly string[]
): Promise<AuthUser> {
  const user = await requireUser();

  if (!roles.includes(user.organization.role)) {
    throw new Error("Forbidden");
  }

  return user;
}

export async function requireOwner(): Promise<AuthUser> {
  return requireRole(["owner"]);
}

export async function requireAdmin(): Promise<AuthUser> {
  return requireRole([
    "owner",
    "admin",
  ]);
}

export async function requireManager(): Promise<AuthUser> {
  return requireRole([
    "owner",
    "admin",
    "manager",
  ]);
}

export async function requireEmployee(): Promise<AuthUser> {
  return requireRole([
    "owner",
    "admin",
    "manager",
    "employee",
  ]);
}