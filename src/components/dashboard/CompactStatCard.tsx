import { ReactNode } from "react";
import { formatCurrency } from "@/lib/currency";

interface CompactStatCardProps {
  title: string;
  value: number | string;
  currency?: string;
  icon: ReactNode;
  color?: "green" | "red" | "blue" | "yellow" | "gray";
  isPercentage?: boolean;
}

const colorClasses = {
  green: "text-green-600",
  red: "text-red-600",
  blue: "text-blue-600",
  yellow: "text-yellow-600",
  gray: "text-gray-600",
};

export function CompactStatCard({
  title,
  value,
  currency,
  icon,
  color = "gray",
  isPercentage = false,
}: CompactStatCardProps) {
  const displayValue = isPercentage
    ? `${value}%`
    : currency
    ? formatCurrency(value as number, currency)
    : value;

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-xl font-bold ${colorClasses[color]}`}>
            {displayValue}
          </p>
        </div>
        <div className={`h-5 w-5 ${colorClasses[color]}`}>{icon}</div>
      </div>
    </div>
  );
}
