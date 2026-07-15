import Link from 'next/link';

import type { Quotation } from '@/types/crm/Quotations';

interface Props {
    quotations: Quotation[];
}

export default function QuotationsTable({
    quotations,
}: Props) {

    return (

        <table className="w-full border">

            <thead>

                <tr>
                    <th>No.</th>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Status</th>
                </tr>

            </thead>

            <tbody>

                {quotations.map((q) => (

                    <tr key={q.id}>

                        <td>

                            <Link href={`/crm/quotations/${q.id}`}>
                                {q.quotationNumber}
                            </Link>

                        </td>

                        <td>{q.customerName}</td>

                        <td>{q.amount}</td>

                        <td>{q.status}</td>

                    </tr>

                ))}

            </tbody>

        </table>

    );

}