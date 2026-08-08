"use client";


import type {
    FilterCondition,
} from "@/types/shared/Filter";



interface FilterChipsProps {


    filters:
        FilterCondition[];


    onRemove:
        (
            index: number
        ) => void;

}



export default function FilterChips({

    filters,

    onRemove,

}: FilterChipsProps) {


    if(filters.length === 0){

        return null;

    }



    return (

        <div
            className="
                flex
                flex-wrap
                gap-2
            "
        >

            {
                filters.map(
                    (
                        filter,
                        index,
                    ) => (

                        <div

                            key={
                                `${filter.field}-${index}`
                            }

                            className="
                                flex
                                items-center
                                gap-2
                                rounded-full
                                border
                                px-3
                                py-1
                                text-sm
                            "

                        >

                            <span>

                                {
                                    filter.label
                                    ??
                                    filter.field
                                }

                                {" "}

                                {

                                    filter.operator

                                }

                                {" "}

                                {

                                    String(
                                        filter.value
                                    )

                                }

                            </span>



                            <button

                                type="button"

                                onClick={
                                    () =>
                                        onRemove(index)
                                }

                                className="
                                    text-xs
                                "

                            >

                                ×

                            </button>


                        </div>

                    )
                )
            }


        </div>

    );

}