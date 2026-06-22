import { NextResponse } from "next/server";

import { contactSchema } from "@/lib/validations/contact";

import { supabaseAdmin } from "@/lib/supabase-admin";

import { resend } from "@/lib/resend";

import { adminLeadTemplate } from "@/lib/email/admin-lead-template";

import { customerConfirmationTemplate } from "@/lib/email/customer-confirmation-template";

export async function POST(
  req: Request
) {
  try {
    const body = await req.json();

    const validation =
      contactSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error:
            validation.error.errors[0]
              ?.message ||
            "Invalid data",
        },
        { status: 400 }
      );
    }

    const data = validation.data;

    const { error } =
      await supabaseAdmin
        .from("contacts")
        .insert([
          {
            name: data.name,
            email: data.email,
            phone: data.phone || "",
            service:
              data.service || "",
            message: data.message,
            source:
              data.source ||
              "website",
            status: "new",
          },
        ]);

    if (error) {
      throw error;
    }

    await resend.emails.send({
      from:
        process.env
          .CONTACT_FROM_EMAIL!,
      to: [
        process.env
          .CONTACT_ADMIN_EMAIL!,
      ],
      subject:
        "New Website Lead",
      html: adminLeadTemplate({
        name: data.name,
        email: data.email,
        phone: data.phone,
        service: data.service,
        message: data.message,
      }),
    });

    await resend.emails.send({
      from:
        process.env
          .CONTACT_FROM_EMAIL!,
      to: [data.email],
      subject:
        "We've Received Your Enquiry",
      html:
        customerConfirmationTemplate(
          {
            name: data.name,
          }
        ),
    });

    return NextResponse.json({
      success: true,
      message:
        "Thank you. We will contact you soon.",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error:
          "Something went wrong.",
      },
      {
        status: 500,
      }
    );
  }
}