"use client";

import NotesPanel from "./NotesPanel";
import type { Note } from "@/types/notes";

interface EntityNotesProps {
    notes: Note[];
}

function EntityNotes({
    notes,
}: EntityNotesProps) {

    return (
        <NotesPanel
            notes={notes}
        />
    );
}

