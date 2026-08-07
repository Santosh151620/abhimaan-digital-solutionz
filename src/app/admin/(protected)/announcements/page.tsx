import {

    getAnnouncements,

} from "./page-actions";



import AnnouncementDialog from "@/components/admin/announcements/AnnouncementDialog";



import AnnouncementTable from "@/components/admin/announcements/AnnouncementTable";







export default async function AnnouncementsPage(){



    const announcements =

        await getAnnouncements();







    return (



        <div className="space-y-6">







            <div className="flex items-center justify-between">







                <div>







                    <h1 className="text-3xl font-bold">



                        Announcements



                    </h1>









                    <p className="text-sm text-gray-500">



                        Manage organization announcements and communication.



                    </p>







                </div>









                <AnnouncementDialog />







            </div>









            <AnnouncementTable



                items={announcements}



            />







        </div>



    );



}