import { ReactNode } from "react";

interface Props {
  title: string;
  description: string;
  action?: ReactNode;
}

export default function PageHeader({
  title,
  description,
  action,
}: Props) {
  return (
    <div className="flex items-center justify-between">

      <div>

        <h1 className="text-4xl font-bold tracking-tight text-white">

          {title}

        </h1>

        <p className="mt-2 text-slate-400">

          {description}

        </p>

      </div>

      {action}

    </div>
  );
}