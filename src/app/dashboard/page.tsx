"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useDashboardData } from "@/hooks/useDashboardData";
import {
  OverallSummary,
  PeriodAnalytics,
  RangeAnalytics,
} from "@/components/dashboard";

export default function Dashboard() {
  const {
    session,
    overallData,
    periodData,
    rangeData,
    loading,
    periodFilter,
    rangeFilter,
    setPeriodFilter,
    setRangeFilter,
  } = useDashboardData();

  if (loading.overall) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-lg text-gray-900">Loading dashboard...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (!overallData) {
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

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {session?.user?.name}!
          </h1>
          <p className="text-gray-800">
            Here&apos;s your comprehensive financial overview
          </p>
        </div>

        {/* Overall Summary */}
        <OverallSummary data={overallData} />

        {/* Period Analytics */}
        <PeriodAnalytics
          data={periodData}
          loading={loading.period}
          filter={periodFilter}
          onFilterChange={setPeriodFilter}
          overallData={overallData}
        />

        {/* Range Analytics */}
        <RangeAnalytics
          data={rangeData}
          loading={loading.range}
          filter={rangeFilter}
          onFilterChange={setRangeFilter}
          overallData={overallData}
        />
      </div>
    </DashboardLayout>
  );
}
