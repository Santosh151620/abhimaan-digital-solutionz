import type { ReactNode } from "react";


interface Props {

    children: ReactNode;

    className?: string;

}


export default function TableCard({

    children,

    className = "",

}: Props) {


    return (

        <div
            className={`
                overflow-hidden
                rounded-2xl
                border
                border-cyan-400/10
                bg-slate-950/80
                shadow-xl
                shadow-black/20
                backdrop-blur-xl
                transition-all
                duration-300
                hover:border-cyan-400/20
                ${className}
            `}
        >

            {children}

        </div>

    );

}