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





