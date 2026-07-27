import type {
    PipelineColumn as PipelineColumnType,
} from '@/types/crm/Pipeline';

import PipelineColumn from './PipelineColumn';

interface Props {

    columns: PipelineColumnType[];

}

export default function PipelineBoard({

    columns,

}: Props) {

    return (

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">

            {columns.map(column => (

                <PipelineColumn
                    key={column.stage.id}
                    column={column}
                />

            ))}

        </div>

    );

}
