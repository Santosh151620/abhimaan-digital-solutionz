interface Props{

title:string;

subtitle?:string;

}

export default function SectionTitle({

title,

subtitle

}:Props){

return(

<div>

<h2 className="text-xl font-bold text-slate-900">

{title}

</h2>

{

subtitle&&(

<p className="mt-1 text-sm text-slate-500">

{subtitle}

</p>

)

}

</div>

);

}