"use client";


import type {
    FilterGroup as FilterGroupType,
} from "@/types/shared/Filter";



interface FilterGroupProps {


    value:
        FilterGroupType;


    onChange:
        (
            value: FilterGroupType
        ) => void;


    children?:
        React.ReactNode;

}



export default function FilterGroup({

    value,

    onChange,

    children,

}: FilterGroupProps) {



    function updateOperator(
        operator:
            "AND"
            | "OR",
    ) {


        onChange({

            ...value,

            operator,

        });

    }



    return (

        <div
            className="
                space-y-3
                rounded-md
                border
                p-3
            "
        >

            <div
                className="
                    flex
                    items-center
                    gap-2
                "
            >

                <label
                    className="
                        text-sm
                        font-medium
                    "
                >
                    Match
                </label>


                <select

                    value={
                        value.operator
                    }

                    onChange={
                        event =>
                            updateOperator(
                                event.target.value as "AND" | "OR"
                            )
                    }

                    className="
                        rounded
                        border
                        px-2
                        py-1
                    "
                >

                    <option value="AND">
                        All conditions
                    </option>


                    <option value="OR">
                        Any condition
                    </option>


                </select>


            </div>



            {children}


        </div>

    );

}