"use client";

interface FilterPanelProps {

    children?:
        React.ReactNode;

}


export default function FilterPanel({

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