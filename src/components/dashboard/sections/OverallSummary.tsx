import { Wallet, TrendingUp, TrendingDown } from "lucide-react";
import { StatCard } from "../StatCard";
import { OverallData } from "@/types/dashboard";

interface OverallSummaryProps {
  data: OverallData;
}

export function OverallSummary({ data }: OverallSummaryProps) {
  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Overall Summary
      </h2>

      {/* Top row - Net Balance */}
      <div className="mb-6">
        <StatCard
          title="Net Balance"
          value={data.netBalance}
          currency={data.currency}
          icon={<Wallet className="h-6 w-6" />}
          color={data.netBalance >= 0 ? "blue" : "orange"}
        />
      </div>

      {/* Bottom row - Income, Base, and Expense */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Base Balance"
          value={data.baseBalance}
          currency={data.currency}
          icon={<Wallet className="h-6 w-6" />}
          color="gray"
        />
        <StatCard
          title="Total Income"
          value={data.totalIncome}
          currency={data.currency}
          icon={<TrendingUp className="h-6 w-6" />}
          color="green"
        />
        <StatCard
          title="Total Expenses"
          value={data.totalExpenses}
          currency={data.currency}
          icon={<TrendingDown className="h-6 w-6" />}
          color="red"
        />
      </div>
    </div>
  );
}
