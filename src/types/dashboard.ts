export interface OverallData {
  baseBalance: number;
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  currency: string;
}

export interface PeriodData {
  selectedMonth?: number;
  selectedYear?: number;
  income: number;
  expenses: number;
  savingsRate: number;
  netBalance: number;
  dailyData: {
    date: string;
    income: number;
    expenses: number;
    net: number;
  }[];
  categoryData: {
    category: string;
    amount: number;
  }[];
}

export interface RangeData {
  startDate: string;
  endDate: string;
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  averageMonthlyIncome: number;
  averageMonthlyExpenses: number;
  savingsRate: number;
  monthlyData: {
    month: string;
    income: number;
    expenses: number;
    net: number;
  }[];
  categoryData: {
    category: string;
    amount: number;
  }[];
  categoryTrends: {
    category: string;
    data: {
      month: string;
      amount: number;
    }[];
  }[];
}

export interface PeriodFilter {
  month: number;
  year: number;
  type: "monthly" | "yearly";
}

export interface RangeFilter {
  preset: "3months" | "6months" | "year" | "thisyear" | "custom";
  startDate: string;
  endDate: string;
}

export interface LoadingState {
  overall: boolean;
  period: boolean;
  range: boolean;
}

export const CHART_COLORS = [
  "#3B82F6",
  "#EF4444",
  "#10B981",
  "#F59E0B",
  "#8B5CF6",
  "#EC4899",
];
