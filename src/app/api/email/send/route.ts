import { Resend } from "resend";
import { requireAdmin } from "@/lib/requireAdmin";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    // 🔐 Protect endpoint
    await requireAdmin();

    const body = await req.json();
    const { email, subject, message } = body;

    if (!email || !subject || !message) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Optional safety guard (basic abuse prevention)
    if (subject.length > 200 || message.length > 5000) {
      return Response.json(
        { error: "Message too large" },
        { status: 400 }
      );
    }

    const { data, error } = await resend.emails.send({
      from: "Abhimaan Digital Solutionz <onboarding@resend.dev>",
      to: email,
      subject,
      html: `
      <!DOCTYPE html>
      <html>
      <body style="margin:0;padding:0;background:#f8fafc;font-family:Arial,sans-serif;">
        <div style="max-width:700px;margin:40px auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;">

          <div style="background:#0f172a;padding:24px;">
            <h1 style="margin:0;color:#ffffff;font-size:24px;">
              Abhimaan Digital Solutionz
            </h1>
          </div>

          <div style="padding:32px;">
            <h2 style="margin-top:0;color:#0f172a;">
              ${subject}
            </h2>

            <div style="color:#475569;line-height:1.8;white-space:pre-wrap;">
              ${message}
            </div>
          </div>

          <div style="background:#f8fafc;padding:18px;border-top:1px solid #e2e8f0;">
            <p style="margin:0;color:#64748b;font-size:12px;">
              Sent from Abhimaan Digital Solutionz CRM
            </p>
          </div>

        </div>
      </body>
      </html>
      `,
    });

    if (error) {
      return Response.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      data,
    });
  } catch (err: any) {
    return Response.json(
      {
        error: err.message || "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }
}