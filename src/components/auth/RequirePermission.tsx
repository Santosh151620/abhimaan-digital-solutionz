"use client";

import { ReactNode } from "react";
import { useAuth } from "@/lib/auth/auth-context";
import { hasPermission } from "@/lib/auth/rbac";

interface Props {
  action: string;
  resource: string;
  children: ReactNode;
  fallback?: ReactNode;
}

export default function RequirePermission({
  action,
  resource,
  children,
  fallback = null,
}: Props) {
  const { user } = useAuth();

  if (!user) return fallback;

  const allowed = hasPermission(user.role, action, resource);

  return allowed ? <>{children}</> : <>{fallback}</>;
}