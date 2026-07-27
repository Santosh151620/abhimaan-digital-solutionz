'use client';

import type {
    Quotation,
} from '@/types/crm/Quotations';


type Props = {

    quotation?: Quotation;

    action?:
        (
            formData: FormData
        ) =>
            void |
            Promise<void>;

};



export default function QuotationsForm({

    quotation,

    action,

}: Props) {


    return (

        <form
            action={action}
            className="space-y-4"
        >


            <input

                name="title"

                defaultValue={
                    quotation?.title ?? ''
                }

                placeholder="Quotation Title"

                className="border rounded p-2 w-full"

            />



            <input

                name="customerName"

                defaultValue={
                    quotation?.customerName ?? ''
                }

                placeholder="Customer Name"

                className="border rounded p-2 w-full"

            />



            <input

                name="companyId"

                defaultValue={
                    quotation?.companyId ?? ''
                }

                placeholder="Company ID"

                className="border rounded p-2 w-full"

            />



            <input

                name="opportunityId"

                defaultValue={
                    quotation?.opportunityId ?? ''
                }

                placeholder="Opportunity ID"

                className="border rounded p-2 w-full"

            />



            <input

                name="amount"

                type="number"

                defaultValue={
                    quotation?.amount ?? 0
                }

                placeholder="Amount"

                className="border rounded p-2 w-full"

            />



            <input

                name="tax"

                type="number"

                defaultValue={
                    quotation?.tax ?? 0
                }

                placeholder="Tax"

                className="border rounded p-2 w-full"

            />



            <input

                name="discount"

                type="number"

                defaultValue={
                    quotation?.discount ?? 0
                }

                placeholder="Discount"

                className="border rounded p-2 w-full"

            />



            <input

                name="currency"

                defaultValue={
                    quotation?.currency ?? 'INR'
                }

                className="border rounded p-2 w-full"

            />



            <input

                name="validUntil"

                type="date"

                defaultValue={
                    quotation?.validUntil ?? ''
                }

                className="border rounded p-2 w-full"

            />



            <textarea

                name="notes"

                defaultValue={
                    quotation?.notes ?? ''
                }

                placeholder="Notes"

                className="border rounded p-2 w-full"

            />



            <select

                name="status"

                defaultValue={
                    quotation?.status ?? 'Draft'
                }

                className="border rounded p-2 w-full"

            >

                <option value="Draft">
                    Draft
                </option>

                <option value="Sent">
                    Sent
                </option>

                <option value="Accepted">
                    Accepted
                </option>

                <option value="Rejected">
                    Rejected
                </option>

            </select>



            <button

                type="submit"

                className="rounded bg-blue-600 px-4 py-2 text-white"

            >

                Save Quotation

            </button>


        </form>

    );

}
