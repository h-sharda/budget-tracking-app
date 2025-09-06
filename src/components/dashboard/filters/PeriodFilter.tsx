import { Filter } from "lucide-react";
import { PeriodFilter as PeriodFilterType } from "@/types/dashboard";
import { useState, useEffect } from "react";

interface PeriodFilterProps {
  filter: PeriodFilterType;
  onFilterChange: (filter: PeriodFilterType) => void;
}

export function PeriodFilter({ filter, onFilterChange }: PeriodFilterProps) {
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAvailableYears = async () => {
      try {
        const response = await fetch("/api/dashboard/years");
        if (response.ok) {
          const data = await response.json();
          setAvailableYears(data.years);
        } else {
          // Fallback to current year if API fails
          setAvailableYears([new Date().getFullYear()]);
        }
      } catch (error) {
        console.error("Error fetching available years:", error);
        // Fallback to current year if API fails
        setAvailableYears([new Date().getFullYear()]);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableYears();
  }, []);
  return (
    <div className="bg-white rounded-lg p-4 mb-6">
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Filter by:</span>
        </div>

        <select
          value={filter.type}
          onChange={(e) =>
            onFilterChange({
              ...filter,
              type: e.target.value as "monthly" | "yearly",
            })
          }
          className="px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900"
        >
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>

        {filter.type === "monthly" && (
          <select
            value={filter.month}
            onChange={(e) =>
              onFilterChange({
                ...filter,
                month: parseInt(e.target.value),
              })
            }
            className="px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(0, i).toLocaleDateString("en-US", {
                  month: "long",
                })}
              </option>
            ))}
          </select>
        )}

        <select
          value={filter.year}
          onChange={(e) =>
            onFilterChange({
              ...filter,
              year: parseInt(e.target.value),
            })
          }
          className="px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900"
          disabled={loading}
        >
          {loading ? (
            <option value="">Loading...</option>
          ) : (
            availableYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))
          )}
        </select>
      </div>
    </div>
  );
}
