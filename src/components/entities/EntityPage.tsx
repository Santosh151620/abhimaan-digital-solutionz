"use client";

interface EntityPageProps {
  header: React.ReactNode;
  overview?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

export default function EntityPage({
  header,
  overview,
  actions,
  children,
}: EntityPageProps) {
  return (
    <div className="space-y-6">

      {header}

      {overview}

      {actions}

      {children}

    </div>
  );
}




