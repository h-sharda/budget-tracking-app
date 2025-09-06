"use client";

import { useMemo } from "react";
import {
  formatDateForDisplay,
  formatDateForInput,
  formatDateTimeForDisplay,
  getLocalDate,
  isValidDate,
  getDateRange,
  getStartOfDay,
  getEndOfDay,
  addDays,
  addMonths,
  addYears,
  getDaysDifference,
  isToday,
  isThisMonth,
  isThisYear,
  getCurrentMonthRange,
  getCurrentYearRange,
  getLast30DaysRange,
  getLast7DaysRange,
  formatDateForChart,
  getMonthName,
  getYear,
} from "@/lib/dateUtils";

/**
 * React hook for date utilities with memoization
 * Provides easy access to date formatting and manipulation functions
 */
export const useDateUtils = () => {
  const utils = useMemo(
    () => ({
      // Display formatting
      formatDateForDisplay,
      formatDateForInput,
      formatDateTimeForDisplay,
      formatDateForChart,

      // Date manipulation
      getLocalDate,
      isValidDate,
      getDateRange,
      getStartOfDay,
      getEndOfDay,
      addDays,
      addMonths,
      addYears,
      getDaysDifference,

      // Date checks
      isToday,
      isThisMonth,
      isThisYear,

      // Period ranges
      getCurrentMonthRange,
      getCurrentYearRange,
      getLast30DaysRange,
      getLast7DaysRange,

      // Utility functions
      getMonthName,
      getYear,
    }),
    []
  );

  return utils;
};

export default useDateUtils;
