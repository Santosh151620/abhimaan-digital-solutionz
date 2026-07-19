import PrimaryButton from "./PrimaryButton";

interface Props{

title:string;

description:string;

buttonText:string;

onClick?:()=>void;

}

export default function EmptyState({

title,

description,

buttonText,

onClick

}:Props){

return(

<div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900 p-20 text-center">

<div className="mx-auto mb-8 h-24 w-24 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center text-5xl">

📦

</div>

<h2 className="text-2xl font-bold text-white">

{title}

</h2>

<p className="mt-4 text-slate-400">

{description}

</p>

<div className="mt-8">

<PrimaryButton onClick={onClick}>

{buttonText}

</PrimaryButton>

</div>

</div>

);

}