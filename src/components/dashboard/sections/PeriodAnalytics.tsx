import { TrendingUp, TrendingDown, DollarSign, Wallet } from "lucide-react";
import { CompactStatCard } from "../CompactStatCard";
import { PeriodFilter } from "../filters/PeriodFilter";
import { BarChart, PieChart, LineChart } from "../charts";
import {
  PeriodData,
  PeriodFilter as PeriodFilterType,
  OverallData,
} from "@/types/dashboard";

interface PeriodAnalyticsProps {
  data: PeriodData | null;
  loading: boolean;
  filter: PeriodFilterType;
  onFilterChange: (filter: PeriodFilterType) => void;
  overallData: OverallData;
}

export function PeriodAnalytics({
  data,
  loading,
  filter,
  onFilterChange,
  overallData,
}: PeriodAnalyticsProps) {
  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Monthly/Yearly Analytics
      </h2>

      <PeriodFilter filter={filter} onFilterChange={onFilterChange} />

      {loading ? (
        <div className="flex items-center justify-center h-32">
          <div className="text-gray-600">Loading period data...</div>
        </div>
      ) : data ? (
        <>
          {/* Period Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <CompactStatCard
              title="Selected Period Income"
              value={data.income}
              currency={overallData.currency}
              icon={<TrendingUp className="h-5 w-5" />}
              color="green"
            />
            <CompactStatCard
              title="Selected Period Expenses"
              value={data.expenses}
              currency={overallData.currency}
              icon={<TrendingDown className="h-5 w-5" />}
              color="red"
            />
            <CompactStatCard
              title="Savings Rate"
              value={data.savingsRate.toFixed(1)}
              icon={<DollarSign className="h-5 w-5" />}
              color="blue"
              isPercentage
            />
            <CompactStatCard
              title="Net Balance"
              value={data.netBalance}
              currency={overallData.currency}
              icon={<Wallet className="h-5 w-5" />}
              color={data.netBalance >= 0 ? "green" : "red"}
            />
          </div>

          {/* Period Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BarChart
              data={[
                {
                  name: filter.type === "monthly" ? "Month" : "Year",
                  income: data.income,
                  expenses: data.expenses,
                },
              ]}
              dataKey="income"
              xAxisKey="name"
              currency={overallData.currency}
              title="Income vs Expenses"
            />
            <PieChart
              data={data.categoryData}
              currency={overallData.currency}
              title="Expenses by Category"
            />
          </div>

          {/* Daily Transaction Trend */}
          {data.dailyData.length > 0 && (
            <div className="mt-6">
              <LineChart
                data={data.dailyData}
                xAxisKey="date"
                currency={overallData.currency}
                title="Daily Transaction Trend"
                showCumulativeToggle={true}
              />
            </div>
          )}
        </>
      ) : null}
    </div>
  );
}
