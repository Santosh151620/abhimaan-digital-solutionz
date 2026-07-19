import type { ReactNode } from "react";

interface Props{

children:ReactNode;

}

export default function TableCard({

children

}:Props){

return(

<div className="overflow-hidden rounded-3xl border border-white/10 bg-white/80 backdrop-blur-xl shadow-xl">

{children}

</div>

);

}