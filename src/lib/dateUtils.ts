/**
 * Centralized date utility functions for consistent date handling across the application
 * All dates are stored in UTC in the database and displayed in user's local timezone
 */

// Frontend utilities for displaying dates to users
export const formatDateForDisplay = (
  date: Date | string,
  locale: string = "en-US"
): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) {
    return "Invalid Date";
  }

  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(dateObj);
};

export const formatDateForInput = (date: Date | string): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) {
    return "";
  }

  // Format as YYYY-MM-DD for HTML date inputs
  return dateObj.toISOString().split("T")[0];
};

export const formatDateTimeForDisplay = (
  date: Date | string,
  locale: string = "en-US"
): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) {
    return "Invalid Date";
  }

  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(dateObj);
};

export const getLocalDate = (date: Date | string): Date => {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) {
    return new Date();
  }

  return dateObj;
};

export const isValidDate = (date: string): boolean => {
  const dateObj = new Date(date);
  return !isNaN(dateObj.getTime());
};

export const getDateRange = (
  startDate: string,
  endDate: string
): { start: Date; end: Date } => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Ensure end date is at the end of the day
  end.setHours(23, 59, 59, 999);

  return { start, end };
};

export const getStartOfDay = (date: Date | string): Date => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const startOfDay = new Date(dateObj);
  startOfDay.setHours(0, 0, 0, 0);
  return startOfDay;
};

export const getEndOfDay = (date: Date | string): Date => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const endOfDay = new Date(dateObj);
  endOfDay.setHours(23, 59, 59, 999);
  return endOfDay;
};

export const addDays = (date: Date | string, days: number): Date => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const newDate = new Date(dateObj);
  newDate.setDate(newDate.getDate() + days);
  return newDate;
};

export const addMonths = (date: Date | string, months: number): Date => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const newDate = new Date(dateObj);
  newDate.setMonth(newDate.getMonth() + months);
  return newDate;
};

export const addYears = (date: Date | string, years: number): Date => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const newDate = new Date(dateObj);
  newDate.setFullYear(newDate.getFullYear() + years);
  return newDate;
};

export const getDaysDifference = (
  date1: Date | string,
  date2: Date | string
): number => {
  const d1 = typeof date1 === "string" ? new Date(date1) : date1;
  const d2 = typeof date2 === "string" ? new Date(date2) : date2;

  const timeDiff = Math.abs(d2.getTime() - d1.getTime());
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
};

export const isToday = (date: Date | string): boolean => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const today = new Date();

  return (
    dateObj.getDate() === today.getDate() &&
    dateObj.getMonth() === today.getMonth() &&
    dateObj.getFullYear() === today.getFullYear()
  );
};

export const isThisMonth = (date: Date | string): boolean => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const today = new Date();

  return (
    dateObj.getMonth() === today.getMonth() &&
    dateObj.getFullYear() === today.getFullYear()
  );
};

export const isThisYear = (date: Date | string): boolean => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const today = new Date();

  return dateObj.getFullYear() === today.getFullYear();
};

// Backend utilities for server-side date handling
export const parseDateToUTC = (dateString: string): Date => {
  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date string: ${dateString}`);
  }

  return date;
};

export const formatDateToUTC = (date: Date): string => {
  return date.toISOString();
};

export const getUTCDateRange = (
  startDate: string,
  endDate: string
): { start: Date; end: Date } => {
  const start = parseDateToUTC(startDate);
  const end = parseDateToUTC(endDate);

  // Ensure end date is at the end of the day in UTC
  end.setUTCHours(23, 59, 59, 999);

  return { start, end };
};

export const getUTCStartOfDay = (date: Date | string): Date => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const startOfDay = new Date(dateObj);
  startOfDay.setUTCHours(0, 0, 0, 0);
  return startOfDay;
};

export const getUTCEndOfDay = (date: Date | string): Date => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const endOfDay = new Date(dateObj);
  endOfDay.setUTCHours(23, 59, 59, 999);
  return endOfDay;
};

// Period calculation utilities
export const getCurrentMonthRange = (): { start: Date; end: Date } => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
    23,
    59,
    59,
    999
  );

  return { start, end };
};

export const getCurrentYearRange = (): { start: Date; end: Date } => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const end = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);

  return { start, end };
};

export const getLast30DaysRange = (): { start: Date; end: Date } => {
  const now = new Date();
  const start = new Date(now);
  start.setDate(start.getDate() - 30);
  start.setHours(0, 0, 0, 0);

  const end = new Date(now);
  end.setHours(23, 59, 59, 999);

  return { start, end };
};

export const getLast7DaysRange = (): { start: Date; end: Date } => {
  const now = new Date();
  const start = new Date(now);
  start.setDate(start.getDate() - 7);
  start.setHours(0, 0, 0, 0);

  const end = new Date(now);
  end.setHours(23, 59, 59, 999);

  return { start, end };
};

// Chart data formatting utilities
export const formatDateForChart = (
  date: Date | string,
  period: "day" | "week" | "month" | "year" = "day"
): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) {
    return "Invalid Date";
  }

  switch (period) {
    case "day":
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
      }).format(dateObj);
    case "week":
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
      }).format(dateObj);
    case "month":
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        year: "2-digit",
      }).format(dateObj);
    case "year":
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
      }).format(dateObj);
    default:
      return formatDateForDisplay(dateObj);
  }
};

export const getMonthName = (
  date: Date | string,
  locale: string = "en-US"
): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) {
    return "Invalid Month";
  }

  return new Intl.DateTimeFormat(locale, {
    month: "long",
  }).format(dateObj);
};

export const getYear = (date: Date | string): number => {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) {
    return new Date().getFullYear();
  }

  return dateObj.getFullYear();
};
