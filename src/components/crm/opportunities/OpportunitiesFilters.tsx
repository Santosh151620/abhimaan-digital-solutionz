'use client';

import type {
    OpportunitySearchFilters,
    OpportunityStage,
    OpportunityStatus,
} from '@/types/crm/Opportunities';


interface Props {

    filters: OpportunitySearchFilters;

    onChange: (
        filters: OpportunitySearchFilters,
    ) => void;

    onClear?: () => void;

}


const stages: OpportunityStage[] = [

    'New',

    'Qualified',

    'Proposal',

    'Negotiation',

    'Won',

    'Lost',

];


const statuses: OpportunityStatus[] = [

    'Open',

    'Won',

    'Lost',

    'On Hold',

];


export default function OpportunitiesFilters({

    filters,

    onChange,

    onClear,

}: Props) {


    function update(
        key: keyof OpportunitySearchFilters,
        value: string,
    ) {

        onChange({

            ...filters,

            [key]:
                value ||
                undefined,

        });

    }


    return (

        <div className="rounded-xl border bg-background p-4">

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">


                <div className="space-y-2 lg:col-span-2">

                    <label
                        htmlFor="opportunity-search"
                        className="text-sm font-medium"
                    >
                        Search
                    </label>

                    <input
                        id="opportunity-search"
                        type="search"
                        value={
                            filters.search ??
                            ''
                        }
                        onChange={event =>
                            update(
                                'search',
                                event.target.value,
                            )
                        }
                        placeholder="Search opportunity name or number..."
                        className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                    />

                </div>


                <div className="space-y-2">

                    <label
                        htmlFor="opportunity-status-filter"
                        className="text-sm font-medium"
                    >
                        Status
                    </label>

                    <select
                        id="opportunity-status-filter"
                        value={
                            filters.status ??
                            ''
                        }
                        onChange={event =>
                            update(
                                'status',
                                event.target.value,
                            )
                        }
                        className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                    >

                        <option value="">
                            All statuses
                        </option>

                        {statuses.map(status => (

                            <option
                                key={status}
                                value={status}
                            >
                                {status}
                            </option>

                        ))}

                    </select>

                </div>


                <div className="space-y-2">

                    <label
                        htmlFor="opportunity-stage-filter"
                        className="text-sm font-medium"
                    >
                        Stage
                    </label>

                    <select
                        id="opportunity-stage-filter"
                        value={
                            filters.stage ??
                            ''
                        }
                        onChange={event =>
                            update(
                                'stage',
                                event.target.value,
                            )
                        }
                        className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                    >

                        <option value="">
                            All stages
                        </option>

                        {stages.map(stage => (

                            <option
                                key={stage}
                                value={stage}
                            >
                                {stage}
                            </option>

                        ))}

                    </select>

                </div>


            </div>


            <div className="mt-4 flex justify-end">

                <button
                    type="button"
                    onClick={() =>
                        onClear?.()
                    }
                    className="rounded-md border px-4 py-2 text-sm hover:bg-muted"
                >
                    Clear Filters
                </button>

            </div>

        </div>

    );

}
