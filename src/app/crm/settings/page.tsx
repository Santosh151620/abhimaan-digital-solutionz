export default function CRMSettingsPage(){

return(

<div className="crm-card p-10">

<h1 className="crm-title">

CRM Personalization

</h1>

<p className="crm-subtitle mt-2">

Theme • Appearance • Accessibility • Language • Profile

</p>

<div className="mt-10 grid gap-6 md:grid-cols-2">

<div className="rounded-xl border p-6">

<h2 className="font-semibold">

Theme

</h2>

<p className="mt-2 text-sm text-slate-500">

Blue / Brown / Green Premium Theme

</p>

</div>

<div className="rounded-xl border p-6">

<h2 className="font-semibold">

Profile Photo

</h2>

<p className="mt-2 text-sm text-slate-500">

Upload avatar

</p>

</div>

<div className="rounded-xl border p-6">

<h2 className="font-semibold">

Language

</h2>

<p className="mt-2 text-sm text-slate-500">

English / Hindi

</p>

</div>

<div className="rounded-xl border p-6">

<h2 className="font-semibold">

Accessibility

</h2>

<p className="mt-2 text-sm text-slate-500">

Font Size / Contrast

</p>

</div>

</div>

</div>

);

}