"use client";

import { useEffect, useState } from "react";

type Note = {
  id: string;
  note: string;
  created_at: string;
};

export default function LeadNotes({ leadId }: { leadId: string }) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [text, setText] = useState("");

  const fetchNotes = async () => {
    const res = await fetch(`/api/leads/${leadId}/notes`);
    const data = await res.json();
    setNotes(data || []);
  };

  useEffect(() => {
    fetchNotes();
  }, [leadId]);

  const addNote = async () => {
    if (!text.trim()) return;

    await fetch(`/api/leads/${leadId}/notes`, {
      method: "POST",
      body: JSON.stringify({ note: text }),
    });

    setText("");
    fetchNotes();
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add internal note..."
          className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
        />

        <button
          onClick={addNote}
          className="bg-teal-600 hover:bg-teal-500 text-white px-4 py-2 rounded-xl"
        >
          Add
        </button>
      </div>

      <div className="space-y-2 max-h-60 overflow-y-auto">
        {notes.map((n) => (
          <div
            key={n.id}
            className="bg-slate-900 border border-slate-800 rounded-xl p-3"
          >
            <p className="text-sm text-slate-300">{n.note}</p>
            <p className="text-[10px] text-slate-500 mt-1">
              {n.created_at.split("T")[0]}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}