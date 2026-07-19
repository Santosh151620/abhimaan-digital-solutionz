"use client";

interface Props{

title:string;

message:string;

type?:"success"|"error"|"warning"|"info";

}

const colours={

success:"border-green-500",

error:"border-red-500",

warning:"border-yellow-500",

info:"border-blue-500"

};

export default function Toast({

title,

message,

type="info"

}:Props){

return(

<div className={`fixed right-6 top-6 z-50 w-80 rounded-2xl border-l-4 bg-white p-5 shadow-xl ${colours[type]}`}>

<h3 className="font-semibold text-slate-900">

{title}

</h3>

<p className="mt-2 text-sm text-slate-500">

{message}

</p>

</div>

);

}