import { getCRMAnalytics } from "@/services/analytics";
import AnalyticsCards from "@/components/dashboard/AnalyticsCards";

export default async function DashboardPage() {
  const data = await getCRMAnalytics();

  return (
    <div className="p-6 space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-white">
          CRM Dashboard
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Overview of leads, clients, revenue and system performance
        </p>
      </div>

      {/* ANALYTICS SYSTEM (REUSABLE LAYER) */}
      <AnalyticsCards data={data} />

    </div>
  );
}