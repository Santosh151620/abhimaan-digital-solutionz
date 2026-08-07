import {

    getLocations,

} from "./page-actions";



import LocationDialog from "@/components/admin/locations/LocationDialog";



import LocationTable from "@/components/admin/locations/LocationTable";






export default async function LocationsPage(){



    const locations =

        await getLocations();







    return (



        <div className="space-y-6">







            <div className="flex items-center justify-between">







                <div>







                    <h1 className="text-3xl font-bold">



                        Locations



                    </h1>









                    <p className="text-sm text-gray-500">



                        Manage organization locations and offices.



                    </p>







                </div>









                <LocationDialog />







            </div>









            <LocationTable



                items={locations}



            />







        </div>





    );



}