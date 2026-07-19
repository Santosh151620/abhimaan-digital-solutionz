export default function WelcomeBanner(){

const hour=new Date().getHours();

const greeting=

hour<12
?"Good Morning"

:hour<17
?"Good Afternoon"

:"Good Evening";

return(

<section className="overflow-hidden rounded-3xl bg-gradient-to-r from-[#0d3d91] via-[#1358c8] to-[#158a67] p-10 text-white shadow-2xl">

<div className="max-w-3xl">

<p className="text-lg opacity-90">

{greeting}

</p>

<h1 className="mt-3 text-5xl font-black">

Welcome to Abhimaan CRM

</h1>

<p className="mt-5 text-lg text-cyan-100">

Enterprise Business Platform

Sales

CRM

Assets

Contracts

Invoices

Support

Projects

Everything together.

</p>

</div>

</section>

);

}