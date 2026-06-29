import { NextResponse } from "next/server";
import { resend } from "@/lib/resend";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      full_name,
      email,
      phone,
      company,
      service_interest,
      message,
    } = body;

    // -----------------------------
    // 1. Basic validation
    // -----------------------------
    if (!full_name || !email || !message) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // -----------------------------
    // 2. Basic spam protection (lightweight)
    // -----------------------------
    const spamKeywords = ["http://", "https://", "casino", "viagra"];
    const combinedText = `${message} ${company || ""}`.toLowerCase();

    if (spamKeywords.some((word) => combinedText.includes(word))) {
      return NextResponse.json(
        { success: false, error: "Spam detected" },
        { status: 400 }
      );
    }

    // -----------------------------
    // 3. Store lead safely
    // -----------------------------
    const supabase = await createClient();

const { error } = await supabase.from("leads").insert([
      {
        full_name,
        email,
        phone,
        company,
        service_interest,
        message,
        status: "New",
      },
    ]);

    if (error) {
      console.error(error);
      return NextResponse.json(
        { success: false, error: "Database error" },
        { status: 500 }
      );
    }

    // -----------------------------
    // 4. Notify admin (CRM workflow)
    // -----------------------------
    await resend.emails.send({
      from: "Abhimaan Digital Solutionz <onboarding@resend.dev>",
      to: process.env.ADMIN_EMAIL!,
      subject: `New Lead • ${full_name}`,
      html: `
      <h2>New Lead Received</h2>
      <p><b>Name:</b> ${full_name}</p>
      <p><b>Email:</b> ${email}</p>
      <p><b>Phone:</b> ${phone || "-"}</p>
      <p><b>Service:</b> ${service_interest || "-"}</p>
      <p><b>Message:</b> ${message}</p>
      `,
    });

    // -----------------------------
    // 5. Send confirmation email to user
    // -----------------------------
    await resend.emails.send({
      from: "Abhimaan Digital Solutionz <onboarding@resend.dev>",
      to: email,
      subject: "Thank you for contacting Abhimaan Digital Solutionz",
      html: `
      <h2>Thank you, ${full_name}</h2>
      <p>We have received your enquiry.</p>
      <p>Our team will contact you soon.</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);

    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}