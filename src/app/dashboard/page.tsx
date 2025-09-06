"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { DollarSign, TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { formatCurrency } from "@/lib/currency";

interface DashboardData {
  currentMonth: {
    totalIncome: number;
    totalExpenses: number;
    baseBalance: number;
    netBalance: number;
    month: number;
    year: number;
    currency: string;
  };
  monthlyData: {
    month: string;
    income: number;
    expenses: number;
    savings: number;
  }[];
  categoryData: {
    category: string;
    amount: number;
  }[];
}

const COLORS = [
  "#3B82F6",
  "#EF4444",
  "#10B981",
  "#F59E0B",
  "#8B5CF6",
  "#EC4899",
];

export default function Dashboard() {
  const { data: session } = useSession();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch("/api/dashboard");
        if (response.ok) {
          const data = await response.json();
          setDashboardData(data);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchDashboardData();
    }
  }, [session]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-lg text-gray-900">Loading dashboard...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (!dashboardData) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-lg text-gray-600">
            Failed to load dashboard data
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const { currentMonth, monthlyData, categoryData } = dashboardData;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {session?.user?.name}!
          </h1>
          <p className="text-gray-800">
            Here&apos;s your financial overview for{" "}
            {new Date(
              currentMonth.year,
              currentMonth.month - 1
            ).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <Wallet className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-800">
                  Base Balance
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(
                    currentMonth.baseBalance,
                    currentMonth.currency
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-800">
                  Total Income
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(
                    currentMonth.totalIncome,
                    currentMonth.currency
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-100">
                <TrendingDown className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-800">
                  Total Expenses
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(
                    currentMonth.totalExpenses,
                    currentMonth.currency
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div
                className={`p-3 rounded-full ${
                  currentMonth.netBalance >= 0 ? "bg-blue-100" : "bg-yellow-100"
                }`}
              >
                <Wallet
                  className={`h-6 w-6 ${
                    currentMonth.netBalance >= 0
                      ? "text-blue-600"
                      : "text-yellow-600"
                  }`}
                />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-800">Net Balance</p>
                <p
                  className={`text-2xl font-bold ${
                    currentMonth.netBalance >= 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {formatCurrency(
                    currentMonth.netBalance,
                    currentMonth.currency
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-800">
                  Savings Rate
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {currentMonth.totalIncome > 0
                    ? (
                        (currentMonth.netBalance / currentMonth.totalIncome) *
                        100
                      ).toFixed(1)
                    : 0}
                  %
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Income vs Expenses Bar Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Income vs Expenses (Last 6 Months)
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => [
                    formatCurrency(value, currentMonth.currency),
                    "",
                  ]}
                />
                <Bar dataKey="income" fill="#10B981" name="Income" />
                <Bar dataKey="expenses" fill="#EF4444" name="Expenses" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Expense Categories Pie Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Expenses by Category
            </h3>
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ category, percent }) =>
                      `${category} ${percent ? (percent * 100).toFixed(0) : 0}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="amount"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) =>
                      formatCurrency(value, currentMonth.currency)
                    }
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-gray-800">
                No expense data available
              </div>
            )}
          </div>
        </div>

        {/* Savings Trend Line Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Savings Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip
                formatter={(value: number) => [
                  formatCurrency(value, currentMonth.currency),
                  "Savings",
                ]}
              />
              <Line
                type="monotone"
                dataKey="savings"
                stroke="#3B82F6"
                strokeWidth={2}
                dot={{ fill: "#3B82F6" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </DashboardLayout>
  );
}
