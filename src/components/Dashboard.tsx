/**
 * Main dashboard layout.
 *
 * Composes all chart and KPI components into a single view.
 * This is the entry point that founders/operators see.
 */

"use client";

import React from "react";
import { useDashboard } from "../hooks/useDashboard";
import {
  formatCurrency,
  formatPercent,
  formatRatio,
} from "../utils/metrics";
import KPICard from "./KPICard";
import TimeRangeSelector from "./TimeRangeSelector";
import MRRChart from "./MRRChart";
import ChurnChart from "./ChurnChart";
import UnitEconomicsChart from "./UnitEconomicsChart";
import CustomerGrowthChart from "./CustomerGrowthChart";
import MetricsTable from "./MetricsTable";

export default function Dashboard() {
  const { data, kpis, range, setRange } = useDashboard();

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.h1}>Startup Dashboard</h1>
          <p style={styles.subtitle}>
            SaaS metrics at a glance â MRR, churn, unit economics, and growth
          </p>
        </div>
        <TimeRangeSelector value={range} onChange={setRange} />
      </div>

      {/* KPI Cards */}
      <div style={styles.kpiGrid}>
        <KPICard
          label="MRR"
          value={formatCurrency(kpis.currentMRR)}
          trend={kpis.mrrGrowthTrend > 0 ? "up" : "down"}
          trendValue={formatPercent(kpis.mrrGrowthTrend)}
          subtitle="month-over-month"
        />
        <KPICard
          label="ARR"
          value={formatCurrency(kpis.currentARR)}
        />
        <KPICard
          label="Customers"
          value={kpis.totalCustomers.toLocaleString()}
        />
        <KPICard
          label="Avg Churn"
          value={formatPercent(kpis.avgChurnRate)}
          trend={kpis.avgChurnRate < 5 ? "up" : "down"}
          subtitle="3-month avg"
        />
        <KPICard
          label="LTV"
          value={formatCurrency(kpis.avgLTV)}
        />
        <KPICard
          label="CAC"
          value={formatCurrency(kpis.avgCAC)}
        />
        <KPICard
          label="LTV:CAC"
          value={formatRatio(kpis.avgLTVCACRatio)}
          trend={kpis.avgLTVCACRatio >= 3 ? "up" : "down"}
          subtitle={kpis.avgLTVCACRatio >= 3 ? "healthy" : "needs work"}
        />
      </div>

      {/* Charts â 2-column grid */}
      <div style={styles.chartGrid}>
        <MRRChart data={data} />
        <ChurnChart data={data} />
        <UnitEconomicsChart data={data} />
        <CustomerGrowthChart data={data} />
      </div>

      {/* Table */}
      <MetricsTable data={data} />
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "32px 24px",
    display: "flex",
    flexDirection: "column",
    gap: 24,
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    background: "#f8fafc",
    minHeight: "100vh",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  h1: {
    fontSize: 28,
    fontWeight: 700,
    color: "#0f172a",
    margin: 0,
  },
  subtitle: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 4,
  },
  kpiGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: 16,
  },
  chartGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(480px, 1fr))",
    gap: 16,
  },
};
