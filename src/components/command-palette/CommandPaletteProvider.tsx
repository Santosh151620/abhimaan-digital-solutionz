"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import CommandPalette from "./CommandPalette";

import {
  CommandPaletteContext,
} from "./CommandPaletteContext";

export default function CommandPaletteProvider({
  children,
}: {
  children: React.ReactNode;
}) {

  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((v) => !v), []);

  useEffect(() => {

    const handler = (e: KeyboardEvent) => {

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        toggle();
      }

      if (e.key === "Escape") {
        close();
      }

    };

    window.addEventListener("keydown", handler);

    return () => window.removeEventListener("keydown", handler);

  }, [toggle, close]);

  const value = useMemo(
    () => ({
      open,
      close,
      toggle,
      isOpen,
    }),
    [open, close, toggle, isOpen]
  );

  return (
    <CommandPaletteContext.Provider value={value}>
      {children}
      {isOpen && <CommandPalette />}
    </CommandPaletteContext.Provider>
  );
}
