"use client";

interface EntityHeaderProps {
  title: string;
  subtitle?: string;
}

export default function EntityHeader({
  title,
  subtitle,
}: EntityHeaderProps) {
  return (
    <div className="space-y-1 border-b pb-4">
      <h1 className="text-2xl font-semibold">
        {title}
      </h1>

      {subtitle && (
        <p className="text-sm text-gray-500">
          {subtitle}
        </p>
      )}
    </div>
  );
}