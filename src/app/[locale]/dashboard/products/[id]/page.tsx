export default async function ProductDetailsPage({
    params,
}:{
    params:{
        id:string;
    };
}){


    return (

        <div>
            Product {params.id}
        </div>

    );

}
