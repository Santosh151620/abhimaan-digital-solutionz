import { PipelineBoard, PipelineSummary } from '@/components/crm/pipeline';

import {
    listPipeline,
    pipelineSummary,
} from './actions';

export default async function PipelinePage() {

    const [columns, summary] = await Promise.all([
        listPipeline(),
        pipelineSummary(),
    ]);

    return (

        <div className="space-y-6">

            <div>

                <h1 className="text-3xl font-bold">
                    Sales Pipeline
                </h1>

                <p className="text-gray-500">
                    Overview of opportunities grouped by sales stage.
                </p>

            </div>

            <PipelineSummary
                stages={summary.stages}
                opportunities={summary.opportunities}
                value={summary.value}
            />

            <PipelineBoard
                columns={columns}
            />

        </div>

    );

}




