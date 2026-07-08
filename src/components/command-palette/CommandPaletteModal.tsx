"use client";

interface Props {
  open: boolean;
  children: React.ReactNode;
}

export default function CommandPaletteModal({
  open,
  children,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm flex items-start justify-center pt-24">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-700 bg-slate-950 shadow-2xl overflow-hidden">
        {children}
      </div>
    </div>
  );
}
