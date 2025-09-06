import { Calendar } from "lucide-react";
import { RangeFilter as RangeFilterType } from "@/types/dashboard";
import { useDateUtils } from "@/hooks/useDateUtils";

interface RangeFilterProps {
  filter: RangeFilterType;
  onFilterChange: (filter: RangeFilterType) => void;
}

const presets = [
  { key: "3months", label: "Last 3 Months" },
  { key: "6months", label: "Last 6 Months" },
  { key: "year", label: "Last Year" },
  { key: "thisyear", label: "This Year" },
] as const;

// Helper function to calculate date ranges for presets
const calculatePresetRange = (
  preset: string,
  dateUtils: ReturnType<typeof useDateUtils>
) => {
  switch (preset) {
    case "3months":
      const threeMonthsAgo = dateUtils.addMonths(new Date(), -3);
      const startOfThreeMonthsAgo = dateUtils.getStartOfDay(threeMonthsAgo);
      const endOfLastMonth = dateUtils.getEndOfDay(
        dateUtils.addDays(new Date(), -1)
      );
      return {
        startDate: dateUtils.formatDateForInput(startOfThreeMonthsAgo),
        endDate: dateUtils.formatDateForInput(endOfLastMonth),
      };
    case "6months":
      const sixMonthsAgo = dateUtils.addMonths(new Date(), -6);
      const startOfSixMonthsAgo = dateUtils.getStartOfDay(sixMonthsAgo);
      const endOfLastMonth6 = dateUtils.getEndOfDay(
        dateUtils.addDays(new Date(), -1)
      );
      return {
        startDate: dateUtils.formatDateForInput(startOfSixMonthsAgo),
        endDate: dateUtils.formatDateForInput(endOfLastMonth6),
      };
    case "year":
      const oneYearAgo = dateUtils.addYears(new Date(), -1);
      const startOfOneYearAgo = dateUtils.getStartOfDay(oneYearAgo);
      const endOfLastMonthYear = dateUtils.getEndOfDay(
        dateUtils.addDays(new Date(), -1)
      );
      return {
        startDate: dateUtils.formatDateForInput(startOfOneYearAgo),
        endDate: dateUtils.formatDateForInput(endOfLastMonthYear),
      };
    case "thisyear":
      const currentYear = new Date().getFullYear();
      const startOfYear = new Date(currentYear, 0, 1);
      const endOfYear = new Date(currentYear, 11, 31);
      return {
        startDate: dateUtils.formatDateForInput(startOfYear),
        endDate: dateUtils.formatDateForInput(endOfYear),
      };
    default:
      return null;
  }
};

export function RangeFilter({ filter, onFilterChange }: RangeFilterProps) {
  const dateUtils = useDateUtils();

  // Calculate date range for current preset
  const currentRange =
    filter.preset !== "custom"
      ? calculatePresetRange(filter.preset, dateUtils)
      : null;

  // Handle date input changes - switch to custom when dates are manually changed
  const handleDateChange = (field: "startDate" | "endDate", value: string) => {
    onFilterChange({
      ...filter,
      preset: "custom",
      [field]: value,
    });
  };

  return (
    <div className="bg-white rounded-lg p-4 mb-6">
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">
            Quick Presets:
          </span>
        </div>

        {presets.map((preset) => (
          <button
            key={preset.key}
            onClick={() =>
              onFilterChange({
                ...filter,
                preset: preset.key,
              })
            }
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              filter.preset === preset.key
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {preset.label}
          </button>
        ))}

        <button
          onClick={() => onFilterChange({ ...filter, preset: "custom" })}
          className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            filter.preset === "custom"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Custom Range
        </button>
      </div>

      {/* Date Range Display */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Date Range:</span>
          {filter.preset === "custom" ? (
            <div className="flex gap-2 items-center">
              <input
                type="date"
                value={filter.startDate}
                onChange={(e) => handleDateChange("startDate", e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900"
              />
              <span className="text-gray-700">to</span>
              <input
                type="date"
                value={filter.endDate}
                onChange={(e) => handleDateChange("endDate", e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900"
              />
            </div>
          ) : currentRange ? (
            <span className="text-sm text-gray-600 bg-gray-100 px-3 py-2 rounded-md">
              {dateUtils.formatDateForDisplay(currentRange.startDate)} to{" "}
              {dateUtils.formatDateForDisplay(currentRange.endDate)}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
