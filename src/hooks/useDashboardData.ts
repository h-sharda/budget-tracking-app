import { useSession } from "next-auth/react";
import { useEffect, useState, useCallback } from "react";
import {
  OverallData,
  PeriodData,
  RangeData,
  PeriodFilter,
  RangeFilter,
  LoadingState,
} from "@/types/dashboard";

export function useDashboardData() {
  const { data: session } = useSession();
  const [overallData, setOverallData] = useState<OverallData | null>(null);
  const [periodData, setPeriodData] = useState<PeriodData | null>(null);
  const [rangeData, setRangeData] = useState<RangeData | null>(null);
  const [hasInitialized, setHasInitialized] = useState(false);

  const [loading, setLoading] = useState<LoadingState>({
    overall: true,
    period: false,
    range: false,
  });

  // Period filter state
  const [periodFilter, setPeriodFilter] = useState<PeriodFilter>({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    type: "monthly",
  });

  // Range filter state
  const [rangeFilter, setRangeFilter] = useState<RangeFilter>({
    preset: "3months",
    startDate: "",
    endDate: "",
  });

  // Fetch overall data
  useEffect(() => {
    const fetchOverallData = async () => {
      try {
        const response = await fetch("/api/dashboard");
        if (response.ok) {
          const data = await response.json();
          setOverallData(data.overall);
        }
      } catch (error) {
        console.error("Error fetching overall data:", error);
      } finally {
        setLoading((prev) => ({ ...prev, overall: false }));
      }
    };

    if (session?.user?.id && !hasInitialized) {
      fetchOverallData();
      setHasInitialized(true);
    }
  }, [session?.user?.id, hasInitialized]);

  // Fetch period data
  const fetchPeriodData = useCallback(async () => {
    setLoading((prev) => ({ ...prev, period: true }));
    try {
      const params = new URLSearchParams();
      if (periodFilter.type === "monthly") {
        params.append("month", periodFilter.month.toString());
        params.append("year", periodFilter.year.toString());
      } else {
        params.append("year", periodFilter.year.toString());
        params.append("type", "yearly");
      }

      const response = await fetch(`/api/dashboard/period?${params}`);
      if (response.ok) {
        const data = await response.json();
        setPeriodData(data);
      }
    } catch (error) {
      console.error("Error fetching period data:", error);
    } finally {
      setLoading((prev) => ({ ...prev, period: false }));
    }
  }, [periodFilter]);

  // Fetch range data
  const fetchRangeData = useCallback(async () => {
    setLoading((prev) => ({ ...prev, range: true }));
    try {
      const params = new URLSearchParams();
      if (rangeFilter.preset === "custom") {
        params.append("startDate", rangeFilter.startDate);
        params.append("endDate", rangeFilter.endDate);
      } else {
        params.append("preset", rangeFilter.preset);
      }

      const response = await fetch(`/api/dashboard/range?${params}`);
      if (response.ok) {
        const data = await response.json();
        setRangeData(data);
      }
    } catch (error) {
      console.error("Error fetching range data:", error);
    } finally {
      setLoading((prev) => ({ ...prev, range: false }));
    }
  }, [rangeFilter]);

  // Fetch period data when filter changes
  useEffect(() => {
    if (session?.user?.id && hasInitialized) {
      fetchPeriodData();
    }
  }, [fetchPeriodData, session?.user?.id, hasInitialized]);

  // Fetch range data when filter changes
  useEffect(() => {
    if (session?.user?.id && hasInitialized) {
      fetchRangeData();
    }
  }, [fetchRangeData, session?.user?.id, hasInitialized]);

  return {
    session,
    overallData,
    periodData,
    rangeData,
    loading,
    periodFilter,
    rangeFilter,
    setPeriodFilter,
    setRangeFilter,
  };
}
