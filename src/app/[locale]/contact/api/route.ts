import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, message, locale } = body;

    // 1. Create localized email layout options depending on their dropdown choice
    let emailSubject = `New Strategy Brief from ${name}`;
    let emailHeading = "New Consultation Form Entry";
    let fieldName = "Name";
    let fieldEmail = "Email";
    let fieldMsg = "Project Goals";

    switch (locale) {
      case "hi":
        emailSubject = `${name} से नया परामर्श अनुरोध`;
        emailHeading = "नया फॉर्म सबमिशन प्राप्त हुआ";
        fieldName = "नाम";
        fieldEmail = "ईमेल पता";
        fieldMsg = "परियोजना विवरण";
        break;
      case "kn":
        emailSubject = `${name} ಅವರಿಂದ ಹೊಸ ಸಮಾಲೋಚನೆ ವಿನಂತಿ`;
        emailHeading = "ಹೊಸ ಫಾರ್ಮ್ ಸಲ್ಲಿಕೆ ಸ್ವೀಕರಿಸಲಾಗಿದೆ";
        fieldName = "ಹೆಸರು";
        fieldEmail = "ಇಮೇಲ್ ವಿಳಾಸ";
        fieldMsg = "ಯೋಜನೆಯ ವಿವರಗಳು";
        break;
      case "te":
        emailSubject = `${name} నుండి కొత్త సంప్రదింపు అభ్యర్థన`;
        emailHeading = "కొత్త ఫారమ్ సమర్పణ స్వీకరించబడింది";
        fieldName = "పేరు";
        fieldEmail = "ఇమెయిల్ చిరునామా";
        fieldMsg = "ప్రాజెక్ట్ వివరాలు";
        break;
      case "mr":
        emailSubject = `${name} कडून नवीन सल्लामसलत विनंती`;
        emailHeading = "नवीन फॉर्म सबमिशन प्राप्त झाले";
        fieldName = "नाव";
        fieldEmail = "ईमेल पत्ता";
        fieldMsg = "प्रकल्प तपशील";
        break;
    }

    // 2. Dispatch the localized template copy straight to your mailbox
    const data = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "abhimaandigitalsolutionz@gmail.com", 
      subject: emailSubject,
      html: `
        <div style="font-family: sans-serif; padding: 30px; background-color: #090d16; color: #f8fafc; border-radius: 12px; border: 1px solid #1e293b; max-width: 600px; mx-auto;">
          <h2 style="color: #2dd4bf; border-b: 1px solid #1e293b; padding-bottom: 10px; margin-bottom: 20px;">
            ${emailHeading}
          </h2>
          <p style="margin-bottom: 12px; font-size: 16px;"><strong>${fieldName}:</strong> ${name}</p>
          <p style="margin-bottom: 12px; font-size: 16px;"><strong>${fieldEmail}:</strong> ${email}</p>
          <p style="margin-bottom: 12px; font-size: 16px; line-height: 1.6;"><strong>${fieldMsg}:</strong> ${message}</p>
          <div style="margin-top: 30px; padding-top: 15px; border-t: 1px solid #1e293b; font-size: 12px; color: #64748b;">
            User Language Context Context Tracked: <span style="color: #2dd4bf; font-weight: bold; uppercase;">${locale}</span>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
