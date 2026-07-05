import { requireAdmin } from "@/lib/requireAdmin";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

type LeadExportRow = {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  company: string | null;
  service_interest: string | null;
  status: string | null;
  created_at: string | null;
};

export async function GET() {
  try {
    await requireAdmin();

    const cookieStore = await cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );

    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      return Response.json(
        {
          error: error.message,
        },
        {
          status: 500,
        }
      );
    }

    const leads = (data ?? []) as LeadExportRow[];

    const headers = [
      "Lead ID",
      "Name",
      "Email",
      "Phone",
      "Company",
      "Service",
      "Status",
      "Created Date",
    ];

    const rows = leads.map((lead) => [
      lead.id,
      lead.full_name ?? "",
      lead.email ?? "",
      lead.phone ?? "",
      lead.company ?? "",
      lead.service_interest ?? "",
      lead.status ?? "New",
      lead.created_at?.split("T")[0] ?? "",
    ]);

    const csv = [
      headers.join(","),
      ...rows.map((row) =>
        row
          .map((value) =>
            `"${String(value).replace(/"/g, '""')}"`
          )
          .join(",")
      ),
    ].join("\n");

    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition":
          'attachment; filename="abhimaan-leads.csv"',
      },
    });
  } catch (err: unknown) {
    return Response.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }
}
