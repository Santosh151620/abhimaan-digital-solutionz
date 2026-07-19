import type { ReactNode } from "react";

interface Props{

title:string;

children:ReactNode;

footer?:ReactNode;

}

export default function FormCard({

title,

children,

footer

}:Props){

return(

<div className="crm-card">

<div className="rounded-3xl border border-white/10 bg-white/80 backdrop-blur-xl shadow-xl p-8">

<h2 className="text-xl font-semibold">

{title}

</h2>

</div>

<div className="grid gap-6 p-8 md:grid-cols-2">

{children}

</div>

{

footer&&(

<div className="sticky bottom-0 flex justify-end gap-3 border-t bg-white px-8 py-5">

{footer}

</div>

)

}

</div>

);

}