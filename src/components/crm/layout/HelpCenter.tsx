"use client";

import { HelpCircle, BookOpen, Search, LifeBuoy } from "lucide-react";

interface Props {
  onClick?: () => void;
}

export default function HelpCenter({
  onClick,
}: Props) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-40 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-white shadow-2xl transition hover:scale-110 hover:bg-blue-700"
    >
      <HelpCircle size={30} />
    </button>
  );
}

export function HelpPanel() {
  return (
    <div className="fixed bottom-28 right-6 z-40 w-80 rounded-2xl border bg-white p-5 shadow-2xl">
      <h2 className="mb-4 text-lg font-bold">
        Help Center
      </h2>

      <div className="space-y-3">
        <button className="flex w-full items-center gap-3 rounded-lg p-3 hover:bg-slate-100">
          <Search size={18} />
          Search Knowledge Base
        </button>

        <button className="flex w-full items-center gap-3 rounded-lg p-3 hover:bg-slate-100">
          <BookOpen size={18} />
          Documentation
        </button>

        <button className="flex w-full items-center gap-3 rounded-lg p-3 hover:bg-slate-100">
          <LifeBuoy size={18} />
          Raise Support Ticket
        </button>
      </div>
    </div>
  );
}