"use client";


interface FilterDateRangeProps {


    from?: string;


    to?: string;


    onChange:
        (
            range: {
                from?: string;
                to?: string;
            }
        ) => void;

}



export default function FilterDateRange({

    from,

    to,

    onChange,

}: FilterDateRangeProps) {



    return (

        <div
            className="
                flex
                gap-3
                items-end
            "
        >

            <div
                className="
                    flex
                    flex-col
                    gap-1
                "
            >

                <label
                    className="
                        text-sm
                        font-medium
                    "
                >
                    From
                </label>


                <input

                    type="date"

                    value={
                        from ?? ""
                    }

                    onChange={
                        event =>
                            onChange({

                                from:
                                    event.target.value
                                    ||
                                    undefined,

                                to,

                            })
                    }

                    className="
                        rounded
                        border
                        px-2
                        py-1
                    "

                />

            </div>



            <div
                className="
                    flex
                    flex-col
                    gap-1
                "
            >

                <label
                    className="
                        text-sm
                        font-medium
                    "
                >
                    To
                </label>


                <input

                    type="date"

                    value={
                        to ?? ""
                    }

                    onChange={
                        event =>
                            onChange({

                                from,

                                to:
                                    event.target.value
                                    ||
                                    undefined,

                            })
                    }

                    className="
                        rounded
                        border
                        px-2
                        py-1
                    "

                />

            </div>


        </div>

    );

}