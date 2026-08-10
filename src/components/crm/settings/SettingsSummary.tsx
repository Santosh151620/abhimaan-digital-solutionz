'use client';


import type {
    SettingsSummary as SettingsSummaryModel,
} from '@/types/crm/Settings';



interface Props {

    summary: SettingsSummaryModel;

}



interface CardProps {

    title: string;

    value: number;

    description: string;

}



function SummaryCard({
    title,
    value,
    description,
}: CardProps) {


    return (

        <div
            className="
                crm-card
                p-5
                transition
                hover:-translate-y-1
                hover:shadow-md
            "
        >

            <div className="text-sm text-muted-foreground">
                {title}
            </div>


            <div className="mt-3 text-3xl font-bold">
                {value}
            </div>


            <p className="mt-2 text-xs text-muted-foreground">
                {description}
            </p>


        </div>

    );

}



export default function SettingsSummary({
    summary,
}: Props) {


    return (

        <div
            className="
                grid
                gap-5
                sm:grid-cols-2
                lg:grid-cols-5
            "
        >


            <SummaryCard

                title="Total"

                value={
                    summary.total
                }

                description="All configured settings"

            />


            <SummaryCard

                title="Active"

                value={
                    summary.active
                }

                description="Currently enabled"

            />


            <SummaryCard

                title="Inactive"

                value={
                    summary.inactive
                }

                description="Disabled settings"

            />


            <SummaryCard

                title="Editable"

                value={
                    summary.editable
                }

                description="User editable values"

            />


            <SummaryCard

                title="Encrypted"

                value={
                    summary.encrypted
                }

                description="Protected values"

            />


        </div>

    );

}