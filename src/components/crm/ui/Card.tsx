import type { ReactNode } from "react";

export default function Card({
    children,
}:{
    children:ReactNode;
}){

return(

<div
className="rounded-3xl
border border-white/10
bg-white/75
backdrop-blur-xl
shadow-xl
transition-all
duration-300
hover:-translate-y-1
hover:shadow-2xl">

{children}

</div>

);

}