    import { execute } from "./actions";
    import { CommandItem } from "./types";

    export const commandRegistry: CommandItem[] = [

    {
    id:"dashboard",
    title:"Dashboard",
    subtitle:"CRM Dashboard",
    group:"Navigation",
    route:"/en/dashboard",
    shortcut:"G D",
    action:"navigate",
    keywords:["dashboard"],
    run(){execute(this);}
    },

    {
    id:"leads",
    title:"Leads",
    subtitle:"Lead Workspace",
    group:"Navigation",
    route:"/en/dashboard/leads",
    shortcut:"G L",
    action:"navigate",
    keywords:["lead","crm"],
    run(){execute(this);}
    },

    {
    id:"clients",
    title:"Clients",
    subtitle:"Client Workspace",
    group:"Navigation",
    route:"/en/dashboard/clients",
    shortcut:"G C",
    action:"navigate",
    keywords:["clients"],
    run(){execute(this);}
    },

    {
    id:"projects",
    title:"Projects",
    subtitle:"Project Workspace",
    group:"Navigation",
    route:"/en/dashboard/projects",
    shortcut:"G P",
    action:"navigate",
    keywords:["projects"],
    run(){execute(this);}
    },

    {
    id:"analytics",
    title:"Analytics",
    subtitle:"Analytics Dashboard",
    group:"Navigation",
    route:"/en/dashboard/analytics",
    shortcut:"G A",
    action:"navigate",
    keywords:["analytics"],
    run(){execute(this);}
    },

    {
    id:"payments",
    title:"Payments",
    subtitle:"Finance",
    group:"Navigation",
    route:"/en/dashboard/payments",
    shortcut:"G Y",
    action:"navigate",
    keywords:["payments"],
    run(){execute(this);}
    },

    {
    id:"email",
    title:"Email",
    subtitle:"Email Center",
    group:"Navigation",
    route:"/en/dashboard/email",
    shortcut:"G E",
    action:"navigate",
    keywords:["email"],
    run(){execute(this);}
    },

    {
    id:"newlead",
    title:"New Lead",
    subtitle:"Create Lead",
    group:"CRM",
    action:"newLead",
    keywords:["new","lead"],
    run(){execute(this);}
    },

    {
    id:"search",
    title:"Search Leads",
    subtitle:"Lead Search",
    group:"CRM",
    action:"searchLead",
    keywords:["search","lead"],
    run(){execute(this);}
    },

    {
    id:"copilot",
    title:"AI Copilot",
    subtitle:"Coming Soon",
    group:"Intelligence",
    disabled:true,
    badge:"Soon",
    action:"copilot",
    keywords:["ai"],
    run(){execute(this);}
    },

    {
    id:"proposal",
    title:"Create Proposal",
    subtitle:"Coming Soon",
    group:"Actions",
    disabled:true,
    badge:"Soon",
    action:"proposal",
    keywords:["proposal"],
    run(){execute(this);}
    },

    {
    id:"invoice",
    title:"Create Invoice",
    subtitle:"Coming Soon",
    group:"Actions",
    disabled:true,
    badge:"Soon",
    action:"invoice",
    keywords:["invoice"],
    run(){execute(this);}
    },

    {
    id:"entitysearch",
    title:"Entity Search",
    subtitle:"Coming Soon",
    group:"Intelligence",
    disabled:true,
    badge:"Soon",
    action:"entitySearch",
    keywords:["entity"],
    run(){execute(this);}
    },

    {
    id:"globalsearch",
    title:"Global CRM Search",
    subtitle:"Coming Soon",
    group:"Intelligence",
    disabled:true,
    badge:"Soon",
    action:"globalSearch",
    keywords:["global"],
    run(){execute(this);}
    },

    {
    id:"logout",
    title:"Logout",
    subtitle:"Sign Out",
    group:"Navigation",
    route:"/logout",
    shortcut:"",
    action:"logout",
    keywords:["logout"],
    run(){execute(this);}
    }

    ];






