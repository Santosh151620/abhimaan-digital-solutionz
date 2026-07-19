import type { ReactNode } from "react";

interface Props {
  title: string;
  description: string;
  toolbar?: ReactNode;
  summary?: ReactNode;
  children: ReactNode;
}

export default function ModulePage({
  title,
  description,
  toolbar,
  summary,
  children,
}: Props) {
  return (
    <div className="space-y-6">

      <div>

        <h1 className="crm-title">
          {title}
        </h1>

        <p className="crm-subtitle mt-2">
          {description}
        </p>

      </div>

      {toolbar}

      {summary}

      <div className="crm-panel">

        {children}

      </div>

    </div>
  );
}