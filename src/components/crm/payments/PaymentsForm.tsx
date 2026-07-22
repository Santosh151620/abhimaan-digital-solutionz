'use client';

import type {
    Payment,
    PaymentMethod,
    PaymentStatus,
} from '@/types/crm/Payments';

interface Props {

    initialData?: Partial<Payment>;

    action: (
        formData: FormData,
    ) =>
        void |
        Promise<void>;

}

const statuses: PaymentStatus[] = [

    'Pending',

    'Paid',

    'Partially Paid',

    'Overdue',

    'Cancelled',

    'Refunded',

];

const methods: PaymentMethod[] = [

    'Cash',

    'Bank Transfer',

    'Cheque',

    'Credit Card',

    'Debit Card',

    'UPI',

    'Wallet',

    'Other',

];

export default function PaymentsForm({

    initialData,

    action,

}: Props) {

    return (

        <form
            action={
                action
                    ? async (formData) => {

                          await action(
                              formData,
                          );

                      }
                    : undefined
            }
            className="space-y-6 rounded-xl border bg-card p-6"
        >

            <div className="grid gap-6 md:grid-cols-2">

                <Input
                    name="paymentNumber"
                    label="Payment Number"
                    defaultValue={initialData?.paymentNumber}
                    required
                />

                <Input
                    name="customerName"
                    label="Customer Name"
                    defaultValue={initialData?.customerName}
                    required
                />

                <Input
                    name="companyId"
                    label="Company ID"
                    defaultValue={initialData?.companyId}
                />

                <Input
                    name="invoiceId"
                    label="Invoice ID"
                    defaultValue={initialData?.invoiceId}
                />

                <Input
                    type="number"
                    name="amount"
                    label="Amount"
                    defaultValue={initialData?.amount}
                />

                <Input
                    type="number"
                    name="paidAmount"
                    label="Paid Amount"
                    defaultValue={initialData?.paidAmount}
                />

                <Input
                    name="currency"
                    label="Currency"
                    defaultValue={
                        initialData?.currency ?? 'INR'
                    }
                />

                <Input
                    name="referenceNumber"
                    label="Reference Number"
                    defaultValue={initialData?.referenceNumber}
                />

                <Input
                    type="date"
                    name="paymentDate"
                    label="Payment Date"
                    defaultValue={initialData?.paymentDate}
                />

                <Input
                    type="date"
                    name="dueDate"
                    label="Due Date"
                    defaultValue={initialData?.dueDate}
                />

                <div>

                    <label className="mb-2 block text-sm font-medium">
                        Payment Method
                    </label>

                    <select
                        name="paymentMethod"
                        defaultValue={
                            initialData?.paymentMethod ??
                            'Bank Transfer'
                        }
                        className="w-full rounded-lg border px-3 py-2"
                    >

                        {methods.map(method => (

                            <option
                                key={method}
                                value={method}
                            >
                                {method}
                            </option>

                        ))}

                    </select>

                </div>

                <div>

                    <label className="mb-2 block text-sm font-medium">
                        Status
                    </label>

                    <select
                        name="status"
                        defaultValue={
                            initialData?.status ??
                            'Pending'
                        }
                        className="w-full rounded-lg border px-3 py-2"
                    >

                        {statuses.map(status => (

                            <option
                                key={status}
                                value={status}
                            >
                                {status}
                            </option>

                        ))}

                    </select>

                </div>

                <div className="md:col-span-2">

                    <label className="mb-2 block text-sm font-medium">
                        Description
                    </label>

                    <textarea
                        rows={4}
                        name="description"
                        defaultValue={initialData?.description}
                        className="w-full rounded-lg border px-3 py-2"
                    />

                </div>

                <div className="md:col-span-2">

                    <label className="mb-2 block text-sm font-medium">
                        Notes
                    </label>

                    <textarea
                        rows={3}
                        name="notes"
                        defaultValue={initialData?.notes}
                        className="w-full rounded-lg border px-3 py-2"
                    />

                </div>

            </div>

            <div className="flex justify-end">

                <button
                    type="submit"
                    className="rounded-lg bg-primary px-6 py-2 text-primary-foreground"
                >
                    Save Payment
                </button>

            </div>

        </form>

    );

}

function Input({

    label,

    ...props

}: React.InputHTMLAttributes<HTMLInputElement> & {

    label: string;

}) {

    return (

        <div>

            <label className="mb-2 block text-sm font-medium">

                {label}

            </label>

            <input
                {...props}
                className="w-full rounded-lg border px-3 py-2"
            />

        </div>

    );

}