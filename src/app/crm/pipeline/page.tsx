import {
    getPipeline,
    getPipelineSummary,
} from './actions';

import CRMPageLayout from '@/components/crm/shared/layout/CRMPageLayout';

import CRMHeader from '@/components/crm/shared/layout/CRMHeader';

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

            <CRMHeader
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