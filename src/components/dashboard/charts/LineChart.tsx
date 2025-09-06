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
import { useState, useMemo } from "react";

interface LineChartData {
  [key: string]: string | number;
}

interface LineChartProps {
  data: LineChartData[];
  xAxisKey: string;
  currency: string;
  title: string;
  height?: number;
  lines?: {
    dataKey: string;
    stroke: string;
    name: string;
  }[];
  showCumulativeToggle?: boolean;
}

export function LineChart({
  data,
  xAxisKey,
  currency,
  title,
  height = 300,
  lines = [
    { dataKey: "income", stroke: "#10B981", name: "Income" },
    { dataKey: "expenses", stroke: "#EF4444", name: "Expenses" },
    { dataKey: "net", stroke: "#3B82F6", name: "Net" },
  ],
  showCumulativeToggle = false,
}: LineChartProps) {
  const [isCumulative, setIsCumulative] = useState(true);

  const chartData = useMemo(() => {
    if (!isCumulative || !showCumulativeToggle) {
      return data;
    }

    return data.map((item, index) => {
      const cumulativeItem = { ...item };

      lines.forEach((line) => {
        const dataKey = line.dataKey;
        if (index === 0) {
          cumulativeItem[dataKey] = item[dataKey] as number;
        } else {
          // Get the previous cumulative value, not the original data
          const previousCumulativeValue = data
            .slice(0, index)
            .reduce(
              (sum, prevItem) => sum + ((prevItem[dataKey] as number) || 0),
              0
            );
          const currentValue = item[dataKey] as number;
          cumulativeItem[dataKey] =
            previousCumulativeValue + (currentValue || 0);
        }
      });

      return cumulativeItem;
    });
  }, [data, isCumulative, showCumulativeToggle, lines]);
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
          <XAxis dataKey={xAxisKey} />
          <YAxis />
          <Tooltip
            formatter={(value: number, name: string) => [
              formatCurrency(value, currency),
              name === "income"
                ? "Income"
                : name === "expenses"
                ? "Expenses"
                : "Net",
            ]}
          />
          {lines.map((line) => (
            <Line
              key={line.dataKey}
              type="monotone"
              dataKey={line.dataKey}
              stroke={line.stroke}
              strokeWidth={2}
              dot={false}
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
}
