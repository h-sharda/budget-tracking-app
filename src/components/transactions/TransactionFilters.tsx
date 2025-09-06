import { Filter } from "lucide-react";
import { TransactionFilters } from "@/types/transaction";
import {
  MONTHS,
  INCOME_CATEGORIES,
  EXPENSE_CATEGORIES,
  ALL_CATEGORIES,
  SORT_OPTIONS,
  SORT_ORDER_OPTIONS,
} from "@/constants/transactions";

interface TransactionFiltersProps {
  filters: TransactionFilters;
  availableYears: number[];
  yearsLoading: boolean;
  currentYear: number;
  onFiltersChange: (filters: Partial<TransactionFilters>) => void;
  onClearFilters: () => void;
}

export function TransactionFiltersComponent({
  filters,
  availableYears,
  yearsLoading,
  currentYear,
  onFiltersChange,
  onClearFilters,
}: TransactionFiltersProps) {
  const years = yearsLoading ? [currentYear] : availableYears;

  // Get categories based on selected type
  const getCategories = () => {
    if (filters.type === "INCOME") return INCOME_CATEGORIES;
    if (filters.type === "EXPENSE") return EXPENSE_CATEGORIES;
    return ALL_CATEGORIES;
  };

  const categories = getCategories();

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex items-center space-x-4">
        <Filter className="h-5 w-5 text-gray-500" />
        <div className="flex flex-wrap gap-4">
          <select
            value={filters.year}
            onChange={(e) => {
              const newYear = e.target.value;
              // If "All Years" is selected and a month is selected, clear the month
              if (newYear === "" && filters.month) {
                onFiltersChange({ year: newYear, month: "" });
              } else {
                onFiltersChange({ year: newYear });
              }
            }}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={yearsLoading}
          >
            <option value="" disabled={filters.month !== ""}>
              {yearsLoading ? "Loading..." : "All Years"}
            </option>
            {years.map((year) => (
              <option key={year} value={year.toString()}>
                {year}
              </option>
            ))}
          </select>

          <select
            value={filters.month}
            onChange={(e) => {
              const newMonth = e.target.value;
              // If month is selected and no year is selected, default to current year
              if (newMonth && !filters.year) {
                onFiltersChange({
                  month: newMonth,
                  year: currentYear.toString(),
                });
              } else {
                onFiltersChange({ month: newMonth });
              }
            }}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Months</option>
            {MONTHS.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>

          <select
            value={filters.type}
            onChange={(e) => {
              const newType = e.target.value;
              // Clear category when type changes
              onFiltersChange({ type: newType, category: "" });
            }}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Types</option>
            <option value="INCOME">Income</option>
            <option value="EXPENSE">Expense</option>
          </select>

          <select
            value={filters.category}
            onChange={(e) => onFiltersChange({ category: e.target.value })}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <select
            value={filters.sortBy}
            onChange={(e) =>
              onFiltersChange({ sortBy: e.target.value as "date" | "amount" })
            }
            className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                Sort by {option.label}
              </option>
            ))}
          </select>

          <select
            value={filters.sortOrder}
            onChange={(e) =>
              onFiltersChange({ sortOrder: e.target.value as "asc" | "desc" })
            }
            className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {SORT_ORDER_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <button
            onClick={onClearFilters}
            className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
}
