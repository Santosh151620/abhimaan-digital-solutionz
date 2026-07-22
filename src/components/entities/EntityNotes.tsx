"use client";

import NotesPanel from "./NotesPanel";
import type { Note } from "@/types/notes";

interface EntityNotesProps {
    notes: Note[];
}

export default function EntityNotes({
    notes,
}: EntityNotesProps) {

    return (
        <NotesPanel
            notes={notes}
        />
    );
}