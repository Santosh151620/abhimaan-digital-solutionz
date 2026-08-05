"use client";


import type {
    SavedFilter,
} from "@/types/crm/Filter";



interface SavedFilterDropdownProps {


    filters:
        SavedFilter[];


    value?:
        string;


    onChange:
        (
            filterId: string
        ) => void;

}



export default function SavedFilterDropdown({

    filters,

    value,

    onChange,

}: SavedFilterDropdownProps) {



    return (

        <select

            value={
                value ?? ""
            }

            onChange={
                event =>
                    onChange(
                        event.target.value
                    )
            }

            className="
                rounded
                border
                px-3
                py-2
            "

        >

            <option value="">
                Select saved filter
            </option>


            {
                filters.map(
                    filter => (

                        <option

                            key={
                                filter.id
                            }

                            value={
                                filter.id
                            }

                        >

                            {
                                filter.name
                            }

                        </option>

                    )
                )
            }


        </select>

    );

}