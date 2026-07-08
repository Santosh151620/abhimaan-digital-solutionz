$root = Get-Location

$folder = Join-Path $root "src\modules\dashboard\notifications"

New-Item -ItemType Directory -Force -Path $folder | Out-Null

@'
export interface DashboardNotification{
    id:string;
    title:string;
    description:string;
    createdAt:string;
}
'@ | Set-Content (Join-Path $folder "types.ts")

@'
import type { DashboardNotification } from "./types";

export const dashboardNotifications:DashboardNotification[]=[
{
id:"1",
title:"New Lead Assigned",
description:"Enterprise lead assigned",
createdAt:"Just now"
},
{
id:"2",
title:"Pipeline Updated",
description:"Opportunity moved to Proposal",
createdAt:"10 min ago"
}
];
'@ | Set-Content (Join-Path $folder "data.ts")

@'
"use client";

import { dashboardNotifications } from "./data";

export default function NotificationCenter(){

return(

<div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">

<h3 className="mb-4 text-lg font-semibold text-white">
Notifications
</h3>

<div className="space-y-3">

{dashboardNotifications.map(item=>(

<div
key={item.id}
className="rounded-xl border border-slate-800 p-3"
>

<div className="font-medium text-white">
{item.title}
</div>

<div className="text-sm text-slate-400">
{item.description}
</div>

<div className="text-xs text-slate-500 mt-2">
{item.createdAt}
</div>

</div>

))}

</div>

</div>

);

}
'@ | Set-Content (Join-Path $folder "NotificationCenter.tsx")

@'
export { default } from "./NotificationCenter";
'@ | Set-Content (Join-Path $folder "index.ts")

Write-Host ""
Write-Host "Notification Center created."