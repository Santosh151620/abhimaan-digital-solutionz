$root = Resolve-Path .

$cp = Join-Path $root "src\components\command-palette\CommandPalette.tsx"

@'
"use client";

import { useEffect, useMemo, useState } from "react";

import CommandPaletteModal from "./CommandPaletteModal";
import { commandRegistry } from "./commands";

export default function CommandPalette() {

  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);

  const commands = useMemo(() => {

    if (!query.trim()) {
      return commandRegistry;
    }

    return commandRegistry.filter((c) =>
      (
        c.title +
        " " +
        (c.subtitle ?? "") +
        " " +
        (c.group ?? "")
      )
        .toLowerCase()
        .includes(query.toLowerCase())
    );

  }, [query]);

const handleQueryChange = (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  setQuery(e.target.value);
  setSelected(0);
};

  useEffect(() => {

    function onKey(e: KeyboardEvent) {

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelected((v) =>
          Math.min(v + 1, Math.max(commands.length - 1, 0))
        );
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelected((v) => Math.max(v - 1, 0));
      }

      if (e.key === "Enter") {

        if (commands[selected]) {
          commands[selected].run();
        }

      }

    }

    window.addEventListener("keydown", onKey);

    return () => window.removeEventListener("keydown", onKey);

  }, [commands, selected]);

  return (

    <CommandPaletteModal open>

      <div className="border-b border-slate-800 p-4">

        <input
          autoFocus
          value={query}
          onChange={handleQueryChange}
          placeholder="Search anything..."
          className="w-full bg-transparent text-white outline-none placeholder:text-slate-500"
        />

      </div>

      <div className="max-h-[520px] overflow-auto p-2">

        {commands.map((cmd, index) => (

          <button
            key={cmd.id}
            onClick={cmd.run}
            className={
              "w-full rounded-xl p-3 text-left transition " +
              (selected === index
                ? "bg-teal-500/20 border border-teal-500/40"
                : "hover:bg-slate-900")
            }
          >

            <div className="flex items-center justify-between">

              <div>

                <div className="font-semibold text-white">
                  {cmd.title}
                </div>

                <div className="text-xs text-slate-400">
                  {cmd.subtitle}
                </div>

              </div>

              <span className="text-[10px] text-slate-500">
                {cmd.shortcut}
              </span>

            </div>

          </button>

        ))}

      </div>

    </CommandPaletteModal>

  );

}
'@ | Set-Content $cp -Encoding UTF8

Write-Host ""
Write-Host "Command Palette V2 installed."
Write-Host ""