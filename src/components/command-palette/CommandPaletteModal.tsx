"use client";

import { ReactNode } from "react";

interface Props {
  open: boolean;
  onClose?: () => void;
  children: ReactNode;
}

export default function CommandPaletteModal({
  open,
  onClose,
  children,
}: Props) {

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm flex items-start justify-center pt-24"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-2xl border border-slate-700 bg-slate-950 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
