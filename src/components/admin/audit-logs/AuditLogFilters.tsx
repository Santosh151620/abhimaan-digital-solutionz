"use client";

import {
    useId,
    useState,
    type ChangeEvent,
} from "react";


interface AuditLogFiltersProps {
    onSearch?(
        value: string,
    ): void;
}

export default function AuditLogFilters({
    onSearch,
}: AuditLogFiltersProps) {
    const inputId =
       useId();
    const [
        value,
        setValue,
    ] = useState("");
    function change(
        next: string,
    ): void {

        setValue(
            next,
        );

        onSearch?.(
            next,
        );
    }
    function handleChange(
        event: ChangeEvent<HTMLInputElement>,
    ): void {
        change(
            event.target.value,
        );
    }

    return (
        <div className="rounded-lg border border-border bg-background p-4">
            <label
                htmlFor={inputId}
                className="
                    mb-2
                    block
                    text-sm
                    font-medium
                    text-foreground
                "
            >
                Search audit logs
            </label>
            <input
                id={inputId}
                type="search"
                className="
                    w-full
                    rounded-md
                    border
                    border-input
                    bg-background
                    p-2
                    text-sm
                    text-foreground
                    outline-none
                    transition
                    placeholder:text-muted-foreground
                    focus:border-ring
                    focus:ring-2
                    focus:ring-ring/20
                "
                placeholder="Search audit logs..."
                aria-label="Search audit logs"
                autoComplete="off"
                value={value}
                onChange={handleChange}
            />
        </div>
    );
}
