"use client";

import type { ReactNode } from "react";

interface Item {
  title: string;
  value: ReactNode;
}

interface EntityOverviewGridProps {
  items: Item[];
}

export default function EntityOverviewGrid({
  items,
}: EntityOverviewGridProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.title}
          className="rounded-xl border border-slate-800 bg-slate-950 p-5"
        >
          <p className="text-sm text-slate-400">
            {item.title}
          </p>

          <div className="mt-2 text-2xl font-semibold text-white">
            {item.value}
          </div>
        </div>
      ))}
    </div>
  );
}




