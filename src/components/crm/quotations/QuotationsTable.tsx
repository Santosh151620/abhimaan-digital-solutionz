import Link from 'next/link';

import {
    restoreQuotation,
} from '@/app/crm/quotations/actions';

import type { Quotation } from '@/types/crm/Quotations';

interface Props {
    quotations: Quotation[];
    archived?: boolean;
}

export default function QuotationsTable({
    quotations,
    archived = false,
}: Props) {

    return (

        <table className="w-full border">

            <thead>

                <tr>
                    <th>No.</th>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Status</th>

                    {archived && (
                        <th>
                            Action
                        </th>
                    )}

                </tr>

            </thead>


            <tbody>

                {quotations.map((q) => (

                    <tr
                        key={q.id}
                        className="border-t"
                    >

                        <td>

                            <Link
                                href={`/crm/quotations/${q.id}`}
                                className="hover:underline"
                            >
                                {q.quotationNumber}
                            </Link>

                        </td>


                        <td>
                            {q.customerName}
                        </td>


                        <td>
                            {q.amount}
                        </td>


                        <td>
                            {q.status}
                        </td>


                        {archived && (

                            <td>

                                <form
                                    action={async () => {
                                        await restoreQuotation(q.id);
                                    }}
                                >

                                    <button
                                        type="submit"
                                        className="rounded border px-3 py-1 text-sm hover:bg-muted"
                                    >
                                        Restore
                                    </button>

                                </form>

                            </td>

                        )}

                    </tr>

                ))}


                {quotations.length === 0 && (

                    <tr>

                        <td
                            colSpan={
                                archived ? 5 : 4
                            }
                            className="p-6 text-center text-muted-foreground"
                        >
                            No quotations found.
                        </td>

                    </tr>

                )}

            </tbody>

        </table>

    );

}