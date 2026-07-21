import { redirect } from 'next/navigation';

interface Props {
    params: Promise<{
        id: string;
    }>;
}

export default async function PipelineOpportunityPage({
    params,
}: Props) {

    const { id } = await params;

    redirect(`/crm/opportunities/${id}`);
}