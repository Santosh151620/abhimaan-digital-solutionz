"use client";

import { useMemo, useState } from "react";

import CommandPaletteModal from "./CommandPaletteModal";
import { commandRegistry } from "./commands";

export default function CommandPalette() {
  const [query, setQuery] = useState("");

  const commands = useMemo(() => {
    if (!query.trim()) return commandRegistry;

    return commandRegistry.filter((c) =>
      (c.title + c.subtitle)
        .toLowerCase()
        .includes(query.toLowerCase())
    );
  }, [query]);

  return (
    <CommandPaletteModal open>

      <div className="border-b border-slate-800 p-4">

        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search anything..."
          className="w-full bg-transparent text-white outline-none placeholder:text-slate-500"
        />

      </div>

      <div className="max-h-[520px] overflow-auto p-2">

        {commands.map((cmd) => (

          <button
            key={cmd.id}
            onClick={cmd.run}
            className="w-full rounded-xl p-3 text-left hover:bg-slate-900"
          >
            <div className="font-semibold text-white">
              {cmd.title}
            </div>

            <div className="text-xs text-slate-400">
              {cmd.subtitle}
            </div>
          </button>

        ))}

      </div>

    </CommandPaletteModal>
  );
}