import { ReactNode } from "react";
import { formatCurrency } from "@/lib/currency";

interface StatCardProps {
  title: string;
  value: number | string;
  currency?: string;
  icon: ReactNode;
  color?: "green" | "red" | "blue" | "yellow" | "gray" | "orange";
  isPercentage?: boolean;
}

const colorClasses = {
  green: "text-green-600",
  red: "text-red-600",
  blue: "text-blue-600",
  yellow: "text-yellow-600",
  gray: "text-gray-600",
  orange: "text-orange-600",
};

const iconBgClasses = {
  green: "bg-green-100",
  red: "bg-red-100",
  blue: "bg-blue-100",
  yellow: "bg-yellow-100",
  gray: "bg-gray-100",
  orange: "bg-orange-100",
};

const iconColorClasses = {
  green: "text-green-600",
  red: "text-red-600",
  orange: "text-orange-600",
  blue: "text-blue-600",
  yellow: "text-yellow-600",
  gray: "text-gray-600",
};

export function StatCard({
  title,
  value,
  currency,
  icon,
  color = "gray",
  isPercentage = false,
}: StatCardProps) {
  const displayValue = isPercentage
    ? `${value}%`
    : currency
    ? formatCurrency(value as number, currency)
    : value;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${iconBgClasses[color]}`}>
          <div className={`h-6 w-6 ${iconColorClasses[color]}`}>{icon}</div>
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-800">{title}</p>
          <p className={`text-2xl font-bold ${colorClasses[color]}`}>
            {displayValue}
          </p>
        </div>
      </div>
    </div>
  );
}
