interface Props {

    title:string;

    subtitle?:string;

}


export default function SectionTitle({

    title,

    subtitle,

}:Props){


    return (

        <div>

            <h2
                className="
                    text-xl
                    font-bold
                    tracking-tight
                    text-white
                "
            >
                {title}
            </h2>


            {subtitle && (

                <p
                    className="
                        mt-1
                        text-sm
                        text-slate-400
                    "
                >
                    {subtitle}
                </p>

            )}

        </div>

    );

}