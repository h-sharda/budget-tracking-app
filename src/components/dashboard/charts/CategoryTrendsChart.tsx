import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatCurrency } from "@/lib/currency";
import { CHART_COLORS } from "@/types/dashboard";
import { useState, useMemo } from "react";

interface CategoryTrendsChartProps {
  categoryTrends: {
    category: string;
    data: {
      month: string;
      amount: number;
    }[];
  }[];
  currency: string;
  title: string;
  height?: number;
  showCumulativeToggle?: boolean;
}

export function CategoryTrendsChart({
  categoryTrends,
  currency,
  title,
  height = 300,
  showCumulativeToggle = false,
}: CategoryTrendsChartProps) {
  const [isCumulative, setIsCumulative] = useState(true);

  const transformedCategoryTrends = useMemo(() => {
    if (!isCumulative || !showCumulativeToggle) {
      return categoryTrends;
    }

    return categoryTrends.map((trend) => ({
      ...trend,
      data: trend.data.map((item, index) => {
        if (index === 0) {
          return { ...item, amount: item.amount };
        }

        // Calculate cumulative sum up to current index
        const cumulativeAmount = trend.data
          .slice(0, index + 1)
          .reduce((sum, prevItem) => sum + prevItem.amount, 0);

        return {
          ...item,
          amount: cumulativeAmount,
        };
      }),
    }));
  }, [categoryTrends, isCumulative, showCumulativeToggle]);

  // Transform data for Recharts - combine all category data into a single dataset
  const chartData = useMemo(() => {
    if (!transformedCategoryTrends.length) return [];

    // Get all unique months and sort them chronologically
    const allMonths = new Set<string>();
    transformedCategoryTrends.forEach((trend) => {
      trend.data.forEach((item) => allMonths.add(item.month));
    });

    // Sort months chronologically
    const sortedMonths = Array.from(allMonths).sort((a, b) => {
      const dateA = new Date(a);
      const dateB = new Date(b);
      return dateA.getTime() - dateB.getTime();
    });

    // Create combined dataset
    return sortedMonths.map((month) => {
      const dataPoint: Record<string, string | number> = { month };
      transformedCategoryTrends.forEach((trend) => {
        const monthData = trend.data.find((item) => item.month === month);
        dataPoint[trend.category] = monthData ? monthData.amount : 0;
      });
      return dataPoint;
    });
  }, [transformedCategoryTrends]);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        {showCumulativeToggle && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Cumulative</span>
            <button
              onClick={() => setIsCumulative(!isCumulative)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isCumulative ? "bg-blue-600" : "bg-gray-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isCumulative ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        )}
      </div>
      <ResponsiveContainer width="100%" height={height}>
        <RechartsLineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip
            formatter={(value: number, name: string) => [
              formatCurrency(value, currency),
              name,
            ]}
          />
          {transformedCategoryTrends.map((trend, index) => (
            <Line
              key={trend.category}
              type="monotone"
              dataKey={trend.category}
              stroke={CHART_COLORS[index % CHART_COLORS.length]}
              strokeWidth={2}
              name={trend.category}
              dot={false}
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
}
