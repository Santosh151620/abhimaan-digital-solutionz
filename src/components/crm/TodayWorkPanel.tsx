import { TodayWorkService } from "@/lib/workflow/todayWorkService";

export default async function TodayWorkPanel() {
  const service = new TodayWorkService();

  const { tasks, metrics } = await service.getTodayWork();

  return (
    <section className="w-full rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          Today’s Work
        </h2>

        <div className="text-sm text-gray-500">
          {metrics.pendingTasks} pending · {metrics.overdueTasks} overdue
        </div>
      </div>

      <div className="space-y-3">
        {tasks.slice(0, 6).map((task) => (
          <div
            key={task.id}
            className="flex items-start justify-between rounded-lg border border-gray-100 p-3 hover:bg-gray-50 transition"
          >
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-900">
                {task.title}
              </p>

              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="capitalize">{task.type}</span>
                <span>•</span>
                <span className="capitalize">{task.priority}</span>
                <span>•</span>
                <span className="capitalize">{task.status}</span>
              </div>
            </div>

            <div className="text-right text-xs text-gray-500">
              {task.dueAt ? (
                <span>
                  Due: {new Date(task.dueAt).toLocaleDateString()}
                </span>
              ) : (
                <span>No due date</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {tasks.length > 6 && (
        <div className="mt-4 text-center text-xs text-gray-500">
          +{tasks.length - 6} more tasks in queue
        </div>
      )}
    </section>
  );
}