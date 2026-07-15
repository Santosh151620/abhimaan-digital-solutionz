import { notFound } from 'next/navigation';

import EditQuotationClient from './EditQuotationClient';

import { updateQuotation } from '../../actions';
import { QuotationsServiceInstance } from '@/services/crm/QuotationsService';

interface Props {
    params: Promise<{
        id: string;
    }>;
}

export default async function EditQuotationPage({
    params,
}: Props) {

    const { id } = await params;

    const quotation =
        await QuotationsServiceInstance.details(id);

    if (!quotation) {
        notFound();
    }

    return (

        <EditQuotationClient
            quotation={quotation}
            updateQuotation={updateQuotation}
        />

    );

}