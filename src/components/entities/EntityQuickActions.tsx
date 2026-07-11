import Link from "next/link";

interface Props {
  entityId: string;
  module: string;
}

export default function EntityQuickActions({
  entityId,
  module,
}: Props) {
  return (
    <div className="rounded-xl border bg-background p-5">

      <h3 className="mb-4 text-lg font-semibold">
        Quick Actions
      </h3>

      <div className="space-y-2">

        <Link
          href={`/${module}/${entityId}`}
          className="block rounded border p-2 hover:bg-muted"
        >
          View Details
        </Link>

        <Link
          href={`/${module}/${entityId}/edit`}
          className="block rounded border p-2 hover:bg-muted"
        >
          Edit
        </Link>

        <button className="w-full rounded border p-2 text-left hover:bg-muted">
          Add Note
        </button>

        <button className="w-full rounded border p-2 text-left hover:bg-muted">
          Add Task
        </button>

        <button className="w-full rounded border p-2 text-left hover:bg-muted">
          Upload Document
        </button>

      </div>

    </div>
  );
}