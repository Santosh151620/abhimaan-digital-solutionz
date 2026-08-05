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

    value: _value,

    onChange: _onChange,

    children,

}: FilterPanelProps) {


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