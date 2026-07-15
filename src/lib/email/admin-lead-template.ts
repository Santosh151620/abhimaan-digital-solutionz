interface AdminLeadEmailProps {
  name: string;
  email: string;
  phone?: string;
  service?: string;
  message: string;
}

export function adminLeadTemplate(
  data: AdminLeadEmailProps
) {
  return `
    <h2>New Lead Received</h2>

    <p><strong>Name:</strong> ${data.name}</p>

    <p><strong>Email:</strong> ${data.email}</p>

    <p><strong>Phone:</strong> ${data.phone || "-"}</p>

    <p><strong>Service:</strong> ${data.service || "-"}</p>

    <p><strong>Message:</strong></p>

    <p>${data.message}</p>
  `;
}





