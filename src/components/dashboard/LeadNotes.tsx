'use client';

import { useCallback, useEffect, useState } from 'react';

type Note = {
  id: string;
  content: string;
};

export default function LeadNotes({ leadId }: { leadId: string }) {
  const [notes, setNotes] = useState<Note[]>([]);

  const fetchNotes = useCallback(async () => {
    if (!leadId) return;

    // TODO: replace with repository/service call
    const data: Note[] = [];

    setNotes(data);
  }, [leadId]);

useEffect(() => {
  const timer = setTimeout(() => {
    void fetchNotes();
  }, 0);

  return () => clearTimeout(timer);
}, [fetchNotes]);

  return (
    <div className="space-y-2">
      {notes.map((note) => (
        <div key={note.id} className="p-2 border rounded">
          {note.content}
        </div>
      ))}
    </div>
  );
}
