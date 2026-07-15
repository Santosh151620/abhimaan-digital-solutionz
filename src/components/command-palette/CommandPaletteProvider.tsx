"use client";

import { useEffect } from "react";

import {
  CommandPaletteProvider as Provider,
  useCommandPalette,
} from "./CommandPaletteContext";

import CommandPalette from "./CommandPalette";

function KeyboardHandler() {

  const { setOpen } = useCommandPalette();

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





