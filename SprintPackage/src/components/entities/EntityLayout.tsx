"use client";

import type { ReactNode } from "react";

interface EntityLayoutProps {
  header?: ReactNode;
  children: ReactNode;
}

export default function EntityLayout({
  header,
  children,
}: EntityLayoutProps) {
  return (
    <div className="space-y-6">
      {header}

      <div>{children}</div>
    </div>
  );
}
