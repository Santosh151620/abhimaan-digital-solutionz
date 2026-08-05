"use client";


import type {
    FilterDefinition,
} from "@/types/crm/Filter";



interface FilterPanelProps {


    value:
        FilterDefinition;


    onChange:
        (
            filter: FilterDefinition
        ) => void;


    children?:
        React.ReactNode;

}



export default function FilterPanel({

    value,

    onChange,

    children,

}: FilterPanelProps) {



    function update(
        changes:
            Partial<FilterDefinition>,
    ) {


        onChange({

            ...value,

            ...changes,

        });

    }



    return (

        <div
            className="
                space-y-4
                rounded-lg
                border
                p-4
            "
        >

            {children}


        </div>

    );

}