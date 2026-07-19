import {
Building2,
Users,
Boxes,
Receipt
} from "lucide-react";

import WelcomeBanner from "@/components/crm/dashboard/WelcomeBanner";
import KPICard from "@/components/crm/ui/KPICard";
import ActivityTimeline from "@/components/crm/dashboard/ActivityTimeline";
import SystemHealth from "@/components/crm/dashboard/SystemHealth";

export default function Dashboard(){

return(

<div className="space-y-8">

<WelcomeBanner/>

<div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

<KPICard

title="Companies"

value="0"

change="Ready"

icon={<Building2/>}

color="bg-blue-600"

/>

<KPICard

title="Contacts"

value="0"

change="Ready"

icon={<Users/>}

color="bg-green-600"

/>

<KPICard

title="Assets"

value="0"

change="Ready"

icon={<Boxes/>}

color="bg-orange-500"

/>

<KPICard

title="Invoices"

value="0"

change="Ready"

icon={<Receipt/>}

color="bg-purple-600"

/>

</div>

<div className="grid gap-8 xl:grid-cols-3">

<div className="xl:col-span-2">

<ActivityTimeline/>

</div>

<SystemHealth/>

</div>

</div>

);

}