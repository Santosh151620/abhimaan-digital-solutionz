import type {
    PipelineColumn,
} from '@/types/crm/Pipeline';

import OpportunityCard from './OpportunityCard';

interface Props {

    column: PipelineColumn;

}

export default function PipelineColumn({

    column,

}: Props) {

    return (

        <div className="rounded-xl border bg-background p-4">

            <div className="mb-4 flex items-center justify-between">

                <h2 className="font-semibold">

                    {column.stage.name}

                </h2>

                <span className="rounded-full bg-muted px-2 py-1 text-xs">

                    {column.opportunities.length}

                </span>

            </div>

            <div className="space-y-3">

                {column.opportunities.map(item => (

                    <OpportunityCard
                        key={item.id}
                        opportunity={item}
                    />

                ))}

                {column.opportunities.length === 0 && (

                    <div className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">

                        No opportunities

                    </div>

                )}

            </div>

        </div>

    );

}