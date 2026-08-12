"use client";

import type { ReactNode } from "react";

import {
    useEffect,
    useState,
} from "react";

import {
    ChevronDown,
    GripVertical,
} from "lucide-react";


interface SortableCollapsibleFrameProps {

    id: string;

    title: string;

    description?: string;

    children: ReactNode;

    defaultOpen?: boolean;

    dragHandleProps?: {
        [key: string]: unknown;
    };

}



export default function SortableCollapsibleFrame({

    id,

    title,

    description,

    children,

    defaultOpen = true,

    dragHandleProps,

}: SortableCollapsibleFrameProps) {



    const collapseKey =
        `ads-collapse-${id}`;



    const [
        open,
        setOpen,
    ] = useState(defaultOpen);




    useEffect(() => {

        if (
            typeof window === "undefined"
        ) {
            return;
        }


        const saved =
            window.localStorage.getItem(
                collapseKey,
            );


        if (
            saved === "closed"
        ) {

            setOpen(false);

        }


    }, [
        collapseKey,
    ]);





    function toggleOpen() {


        setOpen((current)=>{


            const next =
                !current;



            if (
                typeof window !== "undefined"
            ) {

                window.localStorage.setItem(

                    collapseKey,

                    next
                        ? "open"
                        : "closed",

                );

            }



            return next;


        });


    }





    return (

        <section

            className="
                overflow-hidden
                rounded-2xl
                border
                border-cyan-400/20
                bg-slate-950/80
                shadow-xl
                shadow-black/20
                backdrop-blur-xl
                transition-all
                duration-300
                hover:border-cyan-400/30
            "

        >



            <header

                className="
                    flex
                    items-center
                    justify-between
                    gap-4
                    border-b
                    border-slate-800
                    bg-slate-900/60
                    px-4
                    py-4
                    sm:px-5
                "

            >



                <div

                    className="
                        flex
                        min-w-0
                        items-center
                        gap-3
                    "

                >



                    <button

                        type="button"

                        {...dragHandleProps}

                        aria-label={
                            `Move ${title}`
                        }

                        className="
                            flex
                            h-8
                            w-8
                            shrink-0
                            items-center
                            justify-center
                            rounded-lg
                            border
                            border-slate-700
                            bg-slate-900
                            text-slate-400
                            cursor-grab
                            transition
                            hover:border-cyan-400/40
                            hover:text-cyan-300
                            active:cursor-grabbing
                        "

                    >

                        <GripVertical
                            size={16}
                        />

                    </button>





                    <div
                        className="
                            min-w-0
                        "
                    >


                        <h2

                            className="
                                truncate
                                text-sm
                                font-semibold
                                text-white
                                sm:text-base
                            "

                        >

                            {title}

                        </h2>




                        {description && (

                            <p

                                className="
                                    mt-1
                                    truncate
                                    text-xs
                                    text-slate-400
                                    sm:text-sm
                                "

                            >

                                {description}

                            </p>

                        )}



                    </div>



                </div>






                <button

                    type="button"

                    onClick={toggleOpen}

                    aria-expanded={open}

                    aria-label={
                        open
                            ? `Collapse ${title}`
                            : `Expand ${title}`
                    }

                    className="
                        flex
                        h-8
                        w-8
                        shrink-0
                        items-center
                        justify-center
                        rounded-lg
                        border
                        border-cyan-400/20
                        bg-cyan-400/5
                        text-slate-300
                        transition
                        hover:border-cyan-400/50
                        hover:text-cyan-300
                    "

                >

                    <ChevronDown

                        size={16}

                        className={`
                            transition-transform
                            duration-300
                            ${
                                open
                                    ? "rotate-180"
                                    : ""
                            }
                        `}

                    />

                </button>



            </header>






            <div

                className={`
                    grid
                    transition-all
                    duration-300
                    ${
                        open
                            ? "grid-rows-[1fr]"
                            : "grid-rows-[0fr]"
                    }
                `}

            >


                <div

                    className="
                        overflow-hidden
                    "

                >


                    <div

                        className="
                            p-4
                            sm:p-5
                        "

                    >

                        {children}


                    </div>


                </div>


            </div>



        </section>

    );

}