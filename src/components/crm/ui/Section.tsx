import { ReactNode } from "react";

interface Props {
title:string;
children:ReactNode;
}

export default function Section({
title,
children
}:Props){

return(

<div className="space-y-4">

<h2 className="text-lg font-semibold text-white">

{title}

</h2>

{children}

</div>

);

}