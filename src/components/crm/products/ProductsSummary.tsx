import type {
    ProductSummary,
} from '@/types/crm/Products';





interface ProductsSummaryProps {

    summary:ProductSummary;

}






const cards = [
    {
        key:'total',
        label:'Total Products',
    },
    {
        key:'active',
        label:'Active',
    },
    {
        key:'inactive',
        label:'Inactive',
    },
    {
        key:'archived',
        label:'Archived',
    },
] as const;







export default function ProductsSummary(
    {
        summary,
    }:ProductsSummaryProps,
) {


    return (

        <section
            className="
                grid
                gap-4
                sm:grid-cols-2
                lg:grid-cols-4
            "
        >

            {
                cards.map(
                    card =>
                    (

                        <div
                            key={
                                card.key
                            }
                            className="
                                rounded
                                border
                                p-4
                            "
                        >

                            <p
                                className="
                                    text-sm
                                    text-gray-500
                                "
                            >
                                {
                                    card.label
                                }
                            </p>


                            <p
                                className="
                                    mt-2
                                    text-2xl
                                    font-semibold
                                "
                            >
                                {
                                    summary[
                                        card.key
                                    ]
                                }
                            </p>


                        </div>

                    )
                )
            }

        </section>

    );

}
