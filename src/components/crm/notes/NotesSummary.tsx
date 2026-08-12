import {
    Archive,
    FileText,
    StickyNote,
} from "lucide-react";

import type {
    Note,
} from "@/types/crm/Notes";

interface Props {
    notes: Note[];
}

interface SummaryCardProps {
    label: string;
    value: number;
    icon: typeof FileText;
    description: string;
}

function SummaryCard({
    label,
    value,
    icon: Icon,
    description,
}: SummaryCardProps) {
    return (
        <div
            className="
                group
                rounded-2xl
                border
                border-white/10
                bg-white/[0.035]
                p-4
                shadow-lg
                shadow-black/10
                transition-all
                duration-200
                hover:border-amber-300/20
                hover:bg-white/[0.05]
                sm:p-5
            "
        >
            <div
                className="
                    flex
                    items-start
                    justify-between
                    gap-4
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
                        transition
                        group-hover:bg-amber-300/15
                    "
                >
                    <Icon
                        aria-hidden="true"
                        className="h-5 w-5"
                    />
                </div>

                <span
                    className="
                        rounded-full
                        border
                        border-white/10
                        bg-white/[0.03]
                        px-2
                        py-1
                        text-[10px]
                        font-medium
                        uppercase
                        tracking-wider
                        text-slate-500
                    "
                >
                    CRM
                </span>
            </div>

            <div className="mt-4">
                <p
                    className="
                        text-xs
                        font-medium
                        uppercase
                        tracking-[0.12em]
                        text-slate-500
                    "
                >
                    {label}
                </p>

                <p
                    className="
                        mt-1
                        text-2xl
                        font-bold
                        tracking-tight
                        text-white
                    "
                >
                    {value}
                </p>

                <p
                    className="
                        mt-1
                        text-xs
                        text-slate-500
                    "
                >
                    {description}
                </p>
            </div>
        </div>
    );
}

export default function NotesSummary({
    notes,
}: Props) {
    const totalNotes = notes.length;

    const archivedNotes =
        notes.reduce(
            (count, note) =>
                count + (note.archived ? 1 : 0),
            0,
        );

    const activeNotes =
        totalNotes - archivedNotes;

    return (
        <section
            aria-label="Notes summary"
            className="
                grid
                grid-cols-1
                gap-4
                md:grid-cols-3
            "
        >
            <SummaryCard
                label="Total Notes"
                value={totalNotes}
                icon={FileText}
                description="All notes in this view"
            />

            <SummaryCard
                label="Active"
                value={activeNotes}
                icon={StickyNote}
                description="Currently active notes"
            />

            <SummaryCard
                label="Archived"
                value={archivedNotes}
                icon={Archive}
                description="Archived notes"
            />
        </section>
    );
}