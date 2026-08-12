import type { ReactNode } from "react";

interface Props {
    title: string;
    children: ReactNode;
    footer?: ReactNode;
    description?: string;
}


export default function FormCard({
    title,
    children,
    footer,
    description,
}: Props) {

    return (

        <section
            className="
                overflow-hidden
                rounded-3xl
                border
                border-cyan-400/10
                bg-slate-950/80
                shadow-xl
                shadow-black/20
                backdrop-blur-xl
            "
        >

            {/* Header */}

            <div
                className="
                    border-b
                    border-white/10
                    px-6
                    py-5
                "
            >

                <h2
                    className="
                        text-lg
                        font-bold
                        tracking-tight
                        text-white
                    "
                >
                    {title}
                </h2>


                {description && (

                    <p
                        className="
                            mt-1
                            text-sm
                            text-slate-400
                        "
                    >
                        {description}
                    </p>

                )}

            </div>



            {/* Form Body */}

            <div
                className="
                    grid
                    gap-6
                    p-6
                    md:grid-cols-2
                "
            >

                {children}

            </div>



            {/* Footer Actions */}

            {footer && (

                <div
                    className="
                        flex
                        justify-end
                        gap-3
                        border-t
                        border-white/10
                        bg-slate-900/60
                        px-6
                        py-4
                    "
                >

                    {footer}

                </div>

            )}

        </section>

    );

}