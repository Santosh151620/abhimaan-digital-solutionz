cd C:\Projects\MDSWEBSITE\abhimaan-digital-solutionz

$file = ".\src\components\ui\PremiumCard.tsx"

$content = @'
import { ReactNode } from "react";

type PremiumCardProps = {
  children: ReactNode;
  className?: string;
};

export default function PremiumCard({
  children,
  className = "",
}: PremiumCardProps) {
  return (
    <div
      className={`
        rounded-2xl
        border
        border-slate-800
        bg-slate-900
        shadow-lg
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-xl
        ${className}
      `}
    >
      {children}
    </div>
  );
}
'@

Set-Content -LiteralPath $file -Value $content -Encoding UTF8

Write-Host "PremiumCard created."