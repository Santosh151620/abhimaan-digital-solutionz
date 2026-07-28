interface AdminErrorProps {

    message?: string;

}


export default function AdminError({

    message = "Unable to load admin data.",

}: AdminErrorProps) {


    return (

        <div
            className="
                rounded-xl
                border
                border-destructive/30
                bg-destructive/5
                p-6
            "
        >

            <h2 className="text-lg font-semibold text-destructive">

                Something went wrong

            </h2>


            <p className="mt-2 text-sm text-muted-foreground">

                {message}

            </p>


        </div>

    );

}