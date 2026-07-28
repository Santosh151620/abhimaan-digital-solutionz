interface AdminEmptyStateProps {

    title?: string;

    description?: string;

}


export default function AdminEmptyState({

    title = "No records found",

    description = "There are currently no items available.",

}: AdminEmptyStateProps) {


    return (

        <div
            className="
                rounded-xl
                border
                border-dashed
                p-8
                text-center
            "
        >

            <h2 className="text-lg font-semibold">

                {title}

            </h2>


            <p className="mt-2 text-sm text-muted-foreground">

                {description}

            </p>


        </div>

    );

}