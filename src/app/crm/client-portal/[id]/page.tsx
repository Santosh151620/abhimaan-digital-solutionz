export default async function ClientPortalDetailsPage({
    params,
}:{
    params:Promise<{
        id:string;
    }>;
}){


    const {
        id,
    } = await params;



    return (

        <div>
            Client Portal {id}
        </div>

    );

}
