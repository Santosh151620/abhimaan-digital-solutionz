interface CustomerEmailProps {
  name: string;
}

export function customerConfirmationTemplate(
  data: CustomerEmailProps
) {
  return `
    <div style="font-family:sans-serif">

      <h2>
        Thank You For Contacting
        Abhimaan Digital Solutionz
      </h2>

      <p>
        Hi ${data.name},
      </p>

      <p>
        We have successfully received
        your enquiry.
      </p>

      <p>
        Our team will review your
        request and contact you soon.
      </p>

      <br/>

      <p>
        Regards,
      </p>

      <p>
        Abhimaan Digital Solutionz
      </p>

    </div>
  `;
}

