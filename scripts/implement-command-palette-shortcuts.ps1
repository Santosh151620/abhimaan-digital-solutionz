$root = Get-Location
$dir = Join-Path $root "src\components\command-palette"

# -------------------------------------------------------
# CommandPaletteContext.tsx
# -------------------------------------------------------
@'
"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";

interface CommandPaletteContextValue {
  open: boolean;
  setOpen: (value: boolean) => void;
}

const CommandPaletteContext =
  createContext<CommandPaletteContextValue | null>(null);

export function CommandPaletteProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  const value = useMemo(
    () => ({
      open,
      setOpen,
    }),
    [open]
  );

  return (
    <CommandPaletteContext.Provider value={value}>
      {children}
    </CommandPaletteContext.Provider>
  );
}

export function useCommandPalette() {
  const ctx = useContext(CommandPaletteContext);

  if (!ctx) {
    throw new Error(
      "useCommandPalette must be used inside CommandPaletteProvider."
    );
  }

  return ctx;
}
'@ | Set-Content (Join-Path $dir "CommandPaletteContext.tsx")

# -------------------------------------------------------
# CommandPaletteModal.tsx
# -------------------------------------------------------
@'
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
'@ | Set-Content (Join-Path $dir "CommandPaletteModal.tsx")

# -------------------------------------------------------
# CommandPaletteProvider.tsx
# -------------------------------------------------------
@'
"use client";

import { useEffect } from "react";

import {
  CommandPaletteProvider as Provider,
  useCommandPalette,
} from "./CommandPaletteContext";

import CommandPalette from "./CommandPalette";

function KeyboardHandler() {

  const { open, setOpen } = useCommandPalette();

  useEffect(() => {

    function onKey(e: KeyboardEvent) {

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
      }

      if (e.key === "Escape") {
        setOpen(false);
      }

    }

    window.addEventListener("keydown", onKey);

    return () =>
      window.removeEventListener("keydown", onKey);

  }, [setOpen]);

  return (
    <CommandPalette />
  );
}

export default function CommandPaletteProvider({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <Provider>
      {children}
      <KeyboardHandler />
    </Provider>
  );

}
'@ | Set-Content (Join-Path $dir "CommandPaletteProvider.tsx")

# -------------------------------------------------------
# Patch CommandPalette.tsx
# -------------------------------------------------------

$file = Join-Path $dir "CommandPalette.tsx"

$content = Get-Content -LiteralPath $file

$content = $content -replace 'import CommandPaletteModal from "./CommandPaletteModal";', 'import CommandPaletteModal from "./CommandPaletteModal";
import { useCommandPalette } from "./CommandPaletteContext";'

$content = $content -replace 'export default function CommandPalette\(\) \{', 'export default function CommandPalette() {

const { open, setOpen } = useCommandPalette();'

$content = $content -replace '<CommandPaletteModal open>', '<CommandPaletteModal open={open} onClose={() => setOpen(false)}>'

Set-Content -LiteralPath $file -Value $content

Write-Host ""
Write-Host "Command Palette shortcuts implemented."