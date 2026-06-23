import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'
import { resend } from '@/lib/resend'

export async function POST(req: Request) {
  try {
    const {full_name, email, phone, company, service_interest, message  } = await req.json()

await supabase.from("leads").insert([
  {
    full_name,
    email,
    phone,
    company,
    service_interest,
    message,
  },
]);

const { error } = await supabase.from("leads").insert([
  {
    full_name,
    email,
    phone,
    company,
    service_interest,
    message,
  },
]);

if (error) {
  console.error(error);
  throw error;
}

    await resend.emails.send({
      from: 'Abhimaan <onboarding@resend.dev>',
      to: process.env.ADMIN_EMAIL!,
      subject: 'New Lead',
      html: `<p>${full_name} ${phone} </p><p>${email}</p><p>${company}</p><p>${service_interest}</p><p>${message}</p>`
    })

    await resend.emails.send({
      from: 'Abhimaan <onboarding@resend.dev>',
      to: email,
      subject: 'We received your message',
      html: `<p>Thanks ${full_name}, we will contact you soon.</p>`
    })

    return NextResponse.json({ success: true })
  } catch (e) {
    return NextResponse.json({ success: false }, { status: 500 })
  }
}