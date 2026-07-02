import type { UserSession } from "./rbac";

/**
 * Future hook:
 * Replace with NextAuth / Clerk / custom JWT
 */
export async function getSession(): Promise<UserSession | null> {
  // placeholder for backend integration (v7)
  return null;
}