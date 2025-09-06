import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatCurrency } from "@/lib/currency";

interface BarChartData {
  [key: string]: string | number;
}

interface BarChartProps {
  data: BarChartData[];
  dataKey: string;
  xAxisKey: string;
  currency: string;
  title: string;
  height?: number;
  bars?: {
    dataKey: string;
    fill: string;
    name: string;
  }[];
}

export function BarChart({
  data,
  xAxisKey,
  currency,
  title,
  height = 300,
  bars = [
    { dataKey: "income", fill: "#10B981", name: "Income" },
    { dataKey: "expenses", fill: "#EF4444", name: "Expenses" },
  ],
}: BarChartProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        <RechartsBarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xAxisKey} />
          <YAxis />
          <Tooltip
            formatter={(value: number) => [formatCurrency(value, currency), ""]}
          />
          {bars.map((bar) => (
            <Bar
              key={bar.dataKey}
              dataKey={bar.dataKey}
              fill={bar.fill}
              name={bar.name}
            />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}
