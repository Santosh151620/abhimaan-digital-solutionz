import {
    getPipeline,
    getPipelineSummary,
} from './actions';

import CRMPageLayout from '@/components/crm/shared/layout/CRMPageLayout';

import PageHeader from '@/components/crm/ui/PageHeader';

import {
    PipelineBoard,
    PipelineSummary,
} from '@/components/crm/pipeline';

export default async function PipelinePage() {

    const [
        columns,
        summary,
    ] = await Promise.all([
        getPipeline(),
        getPipelineSummary(),
    ]);

    return (

        <CRMPageLayout>

            <PageHeader
                title="Sales Pipeline"
                description="Track opportunities through every sales stage."
            />

            <PipelineSummary
                stages={summary.stages}
                opportunities={summary.opportunities}
                value={summary.value}
            />

            <PipelineBoard
                columns={columns}
            />

        </CRMPageLayout>

    );

}