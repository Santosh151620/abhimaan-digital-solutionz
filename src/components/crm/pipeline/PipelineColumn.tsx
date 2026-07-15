import type { PipelineColumn } from '@/types/crm/Pipeline';

import OpportunityCard from './OpportunityCard';

interface Props {
    column: PipelineColumn;
}

export default function PipelineColumn({
    column,
}: Props) {

    return (

        <div className="rounded-xl border p-4">

            <h2 className="mb-4 font-semibold">
                {column.stage.name}
            </h2>

            <div className="space-y-3">

                {column.opportunities.map(item => (

                    <OpportunityCard
                        key={item.id}
                        opportunity={item}
                    />

                ))}

            </div>

        </div>

    );

}




