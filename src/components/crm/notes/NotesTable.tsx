"use client";

import {
    Archive,
    FileText,
} from "lucide-react";

import type {
    Note,
} from "@/types/crm/Notes";

interface Props {
    notes: Note[];
}

function formatNoteStatus(
    archived: boolean,
): string {
    return archived
        ? "Archived"
        : "Active";
}

export default function NotesTable({
    notes,
}: Props) {
    if (!notes.length) {
        return (
            <div
                className="
                    flex
                    min-h-40
                    flex-col
                    items-center
                    justify-center
                    rounded-2xl
                    border
                    border-dashed
                    border-white/10
                    bg-white/[0.02]
                    px-6
                    py-8
                    text-center
                "
            >
                <div
                    className="
                        flex
                        h-11
                        w-11
                        items-center
                        justify-center
                        rounded-xl
                        bg-white/[0.04]
                        text-slate-500
                    "
                >
                    <FileText
                        aria-hidden="true"
                        className="h-5 w-5"
                    />
                </div>

                <p
                    className="
                        mt-3
                        text-sm
                        font-medium
                        text-slate-300
                    "
                >
                    No notes available
                </p>

                <p
                    className="
                        mt-1
                        text-xs
                        text-slate-500
                    "
                >
                    Notes will appear here when they are
                    added.
                </p>
            </div>
        );
    }

    return (
        <section
            aria-label="Notes"
            className="space-y-3"
        >
            {notes.map((note) => {
                const archived = Boolean(
                    note.archived,
                );

                return (
                    <article
                        key={note.id}
                        className={[
                            "group",
                            "rounded-2xl",
                            "border",
                            "p-4",
                            "transition-all",
                            "duration-200",
                            archived
                                ? [
                                      "border-white/10",
                                      "bg-white/[0.025]",
                                  ].join(" ")
                                : [
                                      "border-white/10",
                                      "bg-white/[0.035]",
                                  ].join(" "),
                            "hover:border-amber-300/20",
                            "hover:bg-white/[0.05]",
                            "sm:p-5",
                        ].join(" ")}
                    >
                        <div
                            className="
                                flex
                                items-start
                                gap-3
                            "
                        >
                            <div
                                className="
                                    flex
                                    h-10
                                    w-10
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-xl
                                    bg-amber-300/10
                                    text-amber-200
                                "
                            >
                                {archived ? (
                                    <Archive
                                        aria-hidden="true"
                                        className="h-5 w-5"
                                    />
                                ) : (
                                    <FileText
                                        aria-hidden="true"
                                        className="h-5 w-5"
                                    />
                                )}
                            </div>

                            <div
                                className="
                                    min-w-0
                                    flex-1
                                "
                            >
                                <div
                                    className="
                                        flex
                                        flex-col
                                        gap-2
                                        sm:flex-row
                                        sm:items-start
                                        sm:justify-between
                                    "
                                >
                                    <h3
                                        className="
                                            min-w-0
                                            break-words
                                            text-sm
                                            font-semibold
                                            text-white
                                        "
                                    >
                                        {note.title ||
                                            "Untitled note"}
                                    </h3>

                                    <span
                                        className={[
                                            "inline-flex",
                                            "w-fit",
                                            "shrink-0",
                                            "items-center",
                                            "rounded-full",
                                            "border",
                                            "px-2",
                                            "py-1",
                                            "text-[10px]",
                                            "font-medium",
                                            "uppercase",
                                            "tracking-wider",
                                            archived
                                                ? [
                                                      "border-slate-500/20",
                                                      "bg-slate-500/10",
                                                      "text-slate-400",
                                                  ].join(
                                                      " ",
                                                  )
                                                : [
                                                      "border-emerald-400/20",
                                                      "bg-emerald-400/10",
                                                      "text-emerald-300",
                                                  ].join(
                                                      " ",
                                                  ),
                                        ].join(" ")}
                                    >
                                        {formatNoteStatus(
                                            archived,
                                        )}
                                    </span>
                                </div>

                                <p
                                    className="
                                        mt-2
                                        whitespace-pre-wrap
                                        break-words
                                        text-sm
                                        leading-6
                                        text-slate-400
                                    "
                                >
                                    {note.content ||
                                        "No content available."}
                                </p>
                            </div>
                        </div>
                    </article>
                );
            })}
        </section>
    );
}