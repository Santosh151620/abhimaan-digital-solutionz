import { navigate } from "./navigation";
import { CommandItem } from "./types";

export const commandRegistry: CommandItem[] = [

{
id:"dashboard",
title:"Dashboard",
subtitle:"CRM Home",
group:"Navigation",
shortcut:"G D",
keywords:["crm","dashboard","home"],
priority:1,
run:()=>navigate("/en/dashboard")
},

{
id:"leads",
title:"Leads",
subtitle:"Lead Management",
group:"CRM",
shortcut:"G L",
keywords:["lead","crm"],
priority:2,
run:()=>navigate("/en/dashboard/leads")
},

{
id:"analytics",
title:"Analytics",
subtitle:"Business Analytics",
group:"CRM",
shortcut:"G A",
keywords:["analytics","reports"],
priority:3,
run:()=>navigate("/en/dashboard/analytics")
},

{
id:"clients",
title:"Clients",
subtitle:"Customer Workspace",
group:"CRM",
shortcut:"G C",
keywords:["clients","customers"],
priority:4,
run:()=>navigate("/en/dashboard/clients")
},

{
id:"projects",
title:"Projects",
subtitle:"Project Workspace",
group:"CRM",
shortcut:"G P",
keywords:["projects"],
priority:5,
run:()=>navigate("/en/dashboard/projects")
},

{
id:"payments",
title:"Payments",
subtitle:"Finance",
group:"CRM",
shortcut:"G Y",
keywords:["payments","finance"],
priority:6,
run:()=>navigate("/en/dashboard/payments")
},

{
id:"email",
title:"Email",
subtitle:"Email Center",
group:"Actions",
shortcut:"G E",
keywords:["email"],
priority:7,
run:()=>navigate("/en/dashboard/email")
},

{
id:"logout",
title:"Logout",
subtitle:"Sign out",
group:"Actions",
shortcut:"",
keywords:["logout"],
priority:100,
run:()=>navigate("/logout")
}

];
