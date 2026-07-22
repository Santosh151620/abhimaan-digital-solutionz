'use client';

import { useState } from 'react';

interface DeleteDialogProps {

    title?: string;

    message?: string;

    confirmLabel?: string;

    cancelLabel?: string;

    disabled?: boolean;

    onConfirm: () => void | Promise<void>;

    trigger?: React.ReactNode;

}

export default function DeleteDialog({

    title = 'Delete Record',

    message = 'Are you sure you want to delete this record? This action can be restored if your module supports archive.',

    confirmLabel = 'Delete',

    cancelLabel = 'Cancel',

    disabled = false,

    onConfirm,

    trigger,

}: DeleteDialogProps) {

    const [open, setOpen] =
        useState(false);

    const [loading, setLoading] =
        useState(false);

    async function handleConfirm() {

        setLoading(true);

        try {

            await onConfirm();

            setOpen(false);

        } finally {

            setLoading(false);

        }

    }

    return (

        <>

            <button
                type="button"
                disabled={disabled}
                onClick={() => setOpen(true)}
            >

                {trigger ?? (

                    <span className="rounded-lg border px-3 py-2">
                        Delete
                    </span>

                )}

            </button>

            {open && (

                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

                    <div className="w-full max-w-md rounded-xl border bg-background p-6 shadow-xl">

                        <h2 className="text-lg font-semibold">
                            {title}
                        </h2>

                        <p className="mt-3 text-sm text-muted-foreground">
                            {message}
                        </p>

                        <div className="mt-6 flex justify-end gap-3">

                            <button
                                type="button"
                                className="rounded-lg border px-4 py-2"
                                onClick={() => setOpen(false)}
                                disabled={loading}
                            >
                                {cancelLabel}
                            </button>

                            <button
                                type="button"
                                className="rounded-lg bg-destructive px-4 py-2 text-destructive-foreground"
                                onClick={handleConfirm}
                                disabled={loading}
                            >
                                {loading
                                    ? 'Deleting...'
                                    : confirmLabel}
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </>

    );

}