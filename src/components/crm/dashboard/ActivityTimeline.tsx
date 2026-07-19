import {
    Building2,
    FileText,
    Wrench,
    CheckCircle2,
} from "lucide-react";

const activities = [
    {
        icon: Building2,
        title: "Company Created",
        time: "09:10 AM",
        color: "text-blue-600",
    },
    {
        icon: FileText,
        title: "Invoice Generated",
        time: "09:45 AM",
        color: "text-green-600",
    },
    {
        icon: Wrench,
        title: "Asset Assigned",
        time: "10:15 AM",
        color: "text-orange-500",
    },
    {
        icon: CheckCircle2,
        title: "Contract Approved",
        time: "11:00 AM",
        color: "text-emerald-600",
    },
];

export default function ActivityTimeline() {
    return (
        <section className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-xl font-bold">
                Recent Activity
            </h2>

            <div className="space-y-6">
                {activities.map((item) => {
                    const Icon = item.icon;

                    return (
                        <div
                            key={item.time}
                            className="flex items-start gap-4"
                        >
                            <div
                                className={`rounded-full bg-slate-100 p-3 ${item.color}`}
                            >
                                <Icon size={18} />
                            </div>

                            <div className="flex-1">
                                <p className="font-semibold">
                                    {item.title}
                                </p>

                                <p className="text-sm text-slate-500">
                                    {item.time}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    )
}
