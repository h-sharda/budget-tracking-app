import { Calendar } from "lucide-react";
import { RangeFilter as RangeFilterType } from "@/types/dashboard";

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
const calculatePresetRange = (preset: string) => {
  const currentDate = new Date();
  let startDate: Date;
  let endDate: Date;

  switch (preset) {
    case "3months":
      startDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - 3,
        1
      );
      endDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        0,
        23,
        59,
        59
      );
      break;
    case "6months":
      startDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - 6,
        1
      );
      endDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        0,
        23,
        59,
        59
      );
      break;
    case "year":
      startDate = new Date(
        currentDate.getFullYear() - 1,
        currentDate.getMonth(),
        1
      );
      endDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        0,
        23,
        59,
        59
      );
      break;
    case "thisyear":
      startDate = new Date(currentDate.getFullYear(), 0, 1);
      endDate = new Date(currentDate.getFullYear(), 11, 31, 23, 59, 59);
      break;
    default:
      return null;
  }

  // Format dates to avoid timezone issues
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return {
    startDate: formatDate(startDate),
    endDate: formatDate(endDate),
  };
};

// Helper function to format date for display
const formatDateForDisplay = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export function RangeFilter({ filter, onFilterChange }: RangeFilterProps) {
  // Calculate date range for current preset
  const currentRange =
    filter.preset !== "custom" ? calculatePresetRange(filter.preset) : null;

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
              {formatDateForDisplay(currentRange.startDate)} to{" "}
              {formatDateForDisplay(currentRange.endDate)}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
