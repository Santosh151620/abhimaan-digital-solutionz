import type { ReactNode } from "react";


interface Props {

    title: string;

    description: string;

    toolbar?: ReactNode;

    summary?: ReactNode;

    children: ReactNode;

}


export default function ModulePage({

    title,

    description,

    toolbar,

    summary,

    children,

}: Props) {


    return (

        <main
            className="
                min-w-0
                space-y-6
            "
        >

            {/* Page Header */}

            <section
                className="
                    rounded-2xl
                    border
                    border-cyan-400/10
                    bg-slate-950/70
                    p-5
                    shadow-xl
                    shadow-black/20
                    backdrop-blur-xl
                "
            >

                <h1
                    className="
                        text-2xl
                        font-black
                        tracking-tight
                        text-white
                        sm:text-3xl
                    "
                >
                    {title}
                </h1>


                <p
                    className="
                        mt-2
                        max-w-3xl
                        text-sm
                        leading-relaxed
                        text-slate-400
                    "
                >
                    {description}
                </p>


            </section>



            {toolbar && (

                <div>

                    {toolbar}

                </div>

            )}



            {summary && (

                <div>

                    {summary}

                </div>

            )}



            <section
                className="
                    rounded-2xl
                    border
                    border-cyan-400/10
                    bg-slate-950/70
                    p-5
                    shadow-xl
                    shadow-black/20
                    backdrop-blur-xl
                "
            >

                {children}

            </section>


        </main>

    );

}