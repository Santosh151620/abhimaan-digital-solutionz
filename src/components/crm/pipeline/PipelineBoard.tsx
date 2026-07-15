import type { PipelineColumn as PipelineColumnType } from '@/types/crm/Pipeline';

import PipelineColumn from './PipelineColumn';

interface Props {
    columns: PipelineColumnType[];
}

export default function PipelineBoard({
    columns,
}: Props) {

    return (

        <div className="grid gap-6 lg:grid-cols-5">

            {columns.map(column => (

                <PipelineColumn
                    key={column.stage.id}
                    column={column}
                />

            ))}

        </div>

    );

}