'use client';

import type {
    Ticket,
    TicketPriority,
    TicketStatus,
} from '@/types/crm/Tickets';

interface Props {
    initialData?: Partial<Ticket>;
    action: (formData: FormData) => void | Promise<void>;
}

const statuses: TicketStatus[] = [
    'Open',
    'In Progress',
    'Resolved',
    'Closed',
];

const priorities: TicketPriority[] = [
    'Low',
    'Medium',
    'High',
    'Critical',
];

export default function TicketsForm({
    initialData,
    action,
}: Props) {

    return (

        <form
            action={action}
            className="space-y-6 rounded-xl border bg-card p-6"
        >

            <div className="grid gap-6 md:grid-cols-2">

                <div>

                    <label className="mb-2 block text-sm font-medium">
                        Ticket Number
                    </label>

                    <input
                        name="ticketNumber"
                        defaultValue={initialData?.ticketNumber}
                        required
                        className="w-full rounded-lg border px-3 py-2"
                    />

                </div>

                <div>

                    <label className="mb-2 block text-sm font-medium">
                        Subject
                    </label>

                    <input
                        name="subject"
                        defaultValue={initialData?.subject}
                        required
                        className="w-full rounded-lg border px-3 py-2"
                    />

                </div>

                <div>

                    <label className="mb-2 block text-sm font-medium">
                        Customer Name
                    </label>

                    <input
                        name="customerName"
                        defaultValue={initialData?.customerName}
                        required
                        className="w-full rounded-lg border px-3 py-2"
                    />

                </div>

                <div>

                    <label className="mb-2 block text-sm font-medium">
                        Company ID
                    </label>

                    <input
                        name="companyId"
                        defaultValue={initialData?.companyId}
                        className="w-full rounded-lg border px-3 py-2"
                    />

                </div>

                <div>

                    <label className="mb-2 block text-sm font-medium">
                        Status
                    </label>

                    <select
                        name="status"
                        defaultValue={initialData?.status ?? 'Open'}
                        className="w-full rounded-lg border px-3 py-2"
                    >
                        {statuses.map((status) => (
                            <option
                                key={status}
                                value={status}
                            >
                                {status}
                            </option>
                        ))}
                    </select>

                </div>

                <div>

                    <label className="mb-2 block text-sm font-medium">
                        Priority
                    </label>

                    <select
                        name="priority"
                        defaultValue={initialData?.priority ?? 'Medium'}
                        className="w-full rounded-lg border px-3 py-2"
                    >
                        {priorities.map((priority) => (
                            <option
                                key={priority}
                                value={priority}
                            >
                                {priority}
                            </option>
                        ))}
                    </select>

                </div>

                <div className="md:col-span-2">

                    <label className="mb-2 block text-sm font-medium">
                        Description
                    </label>

                    <textarea
                        rows={6}
                        name="description"
                        defaultValue={initialData?.description}
                        className="w-full rounded-lg border px-3 py-2"
                    />

                </div>

            </div>

            <div className="flex justify-end">

                <button
                    type="submit"
                    className="rounded-lg bg-primary px-6 py-2 text-primary-foreground"
                >
                    Save Ticket
                </button>

            </div>

        </form>

    );

}