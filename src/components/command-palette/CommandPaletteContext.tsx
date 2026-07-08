"use client";

import { createContext, useContext } from "react";

export interface CommandPaletteContextValue {
  open: () => void;
  close: () => void;
  toggle: () => void;
  isOpen: boolean;
}

export const CommandPaletteContext =
createContext<CommandPaletteContextValue | null>(null);

export function useCommandPalette() {
  const ctx = useContext(CommandPaletteContext);

  if (!ctx) {
    throw new Error("CommandPaletteProvider missing.");
  }

  return ctx;
}
