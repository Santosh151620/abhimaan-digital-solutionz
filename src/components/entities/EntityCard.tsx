"use client";

import type { ReactNode } from "react";

interface EntityCardProps {
  title: string;
  children: ReactNode;
}

export default function EntityCard({
  title,
  children,
}: EntityCardProps) {
  return (
    <div className="rounded-lg border bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold">
        {title}
      </h2>

      {children}
    </div>
  );
}