import { TrendingUp, TrendingDown, DollarSign, Wallet } from "lucide-react";
import { CompactStatCard } from "../CompactStatCard";
import { RangeFilter } from "../filters/RangeFilter";
import { BarChart, PieChart, LineChart, CategoryTrendsChart } from "../charts";
import {
  RangeData,
  RangeFilter as RangeFilterType,
  OverallData,
} from "@/types/dashboard";

interface RangeAnalyticsProps {
  data: RangeData | null;
  loading: boolean;
  filter: RangeFilterType;
  onFilterChange: (filter: RangeFilterType) => void;
  overallData: OverallData;
}

export function RangeAnalytics({
  data,
  loading,
  filter,
  onFilterChange,
  overallData,
}: RangeAnalyticsProps) {
  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Custom Range Analytics
      </h2>

      <RangeFilter filter={filter} onFilterChange={onFilterChange} />

      {loading ? (
        <div className="flex items-center justify-center h-32">
          <div className="text-gray-600">Loading range data...</div>
        </div>
      ) : data ? (
        <>
          {/* Range Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
            <CompactStatCard
              title="Total Income"
              value={data.totalIncome}
              currency={overallData.currency}
              icon={<TrendingUp className="h-5 w-5" />}
              color="green"
            />
            <CompactStatCard
              title="Total Expenses"
              value={data.totalExpenses}
              currency={overallData.currency}
              icon={<TrendingDown className="h-5 w-5" />}
              color="red"
            />
            <CompactStatCard
              title="Net Balance"
              value={data.netBalance}
              currency={overallData.currency}
              icon={<Wallet className="h-5 w-5" />}
              color={data.netBalance >= 0 ? "green" : "red"}
            />
            <CompactStatCard
              title="Avg Monthly Income"
              value={data.averageMonthlyIncome}
              currency={overallData.currency}
              icon={<TrendingUp className="h-5 w-5" />}
              color="green"
            />
            <CompactStatCard
              title="Avg Monthly Expenses"
              value={data.averageMonthlyExpenses}
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
          </div>

          {/* Range Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BarChart
              data={data.monthlyData}
              dataKey="income"
              xAxisKey="month"
              currency={overallData.currency}
              title="Monthly Income vs Expenses"
            />
            <PieChart
              data={data.categoryData}
              currency={overallData.currency}
              title="Expense Categories Distribution"
            />
          </div>

          {/* Savings Trend and Category Trends */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <LineChart
              data={data.monthlyData}
              xAxisKey="month"
              currency={overallData.currency}
              title="Savings Trend"
              lines={[
                { dataKey: "net", stroke: "#3B82F6", name: "Net Balance" },
              ]}
              showCumulativeToggle={true}
            />
            <CategoryTrendsChart
              categoryTrends={data.categoryTrends}
              currency={overallData.currency}
              title="Category Spending Trends"
              showCumulativeToggle={true}
            />
          </div>
        </>
      ) : null}
    </div>
  );
}
