$root = Get-Location

$folder = Join-Path $root "src\modules\dashboard\activity"

New-Item -ItemType Directory -Force -Path $folder | Out-Null

@'
export interface ActivityItem{
    id:string;
    title:string;
    time:string;
}
'@ | Set-Content (Join-Path $folder "types.ts")

@'
import type { ActivityItem } from "./types";

export const dashboardActivities:ActivityItem[]=[
{
id:"1",
title:"Lead converted to Opportunity",
time:"5 min ago"
},
{
id:"2",
title:"Invoice generated",
time:"30 min ago"
},
{
id:"3",
title:"Task completed",
time:"Today"
}
];
'@ | Set-Content (Join-Path $folder "data.ts")

@'
"use client";

import { dashboardActivities } from "./data";

export default function ActivityFeed(){

return(

<div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">

<h3 className="mb-4 text-lg font-semibold text-white">
Recent Activity
</h3>

<div className="space-y-3">

{dashboardActivities.map(item=>(

<div key={item.id} className="border-b border-slate-800 pb-2">

<div className="text-white">
{item.title}
</div>

<div className="text-xs text-slate-500">
{item.time}
</div>

</div>

))}

</div>

</div>

);

}
'@ | Set-Content (Join-Path $folder "ActivityFeed.tsx")

@'
export { default as ActivityFeed } from "./ActivityFeed";
export * from "./types";
export * from "./data";
'@ | Set-Content (Join-Path $folder "index.ts")

Write-Host ""
Write-Host "Dashboard Activity Feed created."