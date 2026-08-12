import type { ReactNode } from "react";


interface CardProps {

    children: ReactNode;

    className?: string;

}


export default function Card({

    children,

    className = "",

}: CardProps) {


    return (

        <div

            className={`
                min-w-0
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
                hover:shadow-cyan-950/20
                ${className}
            `}

        >

            {children}

        </div>

    );

}