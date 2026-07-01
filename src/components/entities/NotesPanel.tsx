"use client";

import type { Note } from "@/types/notes";

interface NotesPanelProps {
  notes: Note[];
}

export default function NotesPanel({
  notes,
}: NotesPanelProps) {
  if (notes.length === 0) {
    return (
      <div className="rounded-lg border p-4 text-sm text-gray-500">
        No notes available.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {notes.map((note) => (
        <div
          key={note.id}
          className="rounded-lg border p-4"
        >
          {note.title && (
            <h3 className="font-medium">
              {note.title}
            </h3>
          )}

          <p className="mt-2 whitespace-pre-wrap text-sm">
            {note.content}
          </p>
        </div>
      ))}
    </div>
  );
}