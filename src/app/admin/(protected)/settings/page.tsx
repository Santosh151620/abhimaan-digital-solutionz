import {

    getSettings,

} from "./page-actions";



import SettingDialog from "@/components/admin/settings/SettingDialog";



import SettingTable from "@/components/admin/settings/SettingTable";







export default async function SettingsPage(){



    const settings =

        await getSettings();







    return (



        <div className="space-y-6">







            <div className="flex items-center justify-between">







                <div>







                    <h1 className="text-3xl font-bold">



                        Platform Settings



                    </h1>









                    <p className="text-sm text-gray-500">



                        Manage enterprise configuration and organization settings.



                    </p>







                </div>









                <SettingDialog />







            </div>









            <SettingTable



                items={settings}



            />







        </div>



    );



}