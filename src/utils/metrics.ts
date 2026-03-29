/**
 * Metric computation engine.
 *
 * Pure functions that derive business-critical KPIs from raw
 * monthly data. Every formula here is standard SaaS metrics
 * methodology â the kind a Series A investor would expect.
 */

import {
  MonthlyMetrics,
  DashboardRow,
  DerivedMetrics,
  KPISummary,
  TimeRange,
} from "../data/types";

/** Compute derived metrics for a single month. */
export function computeDerived(
  current: MonthlyMetrics,
  previous?: MonthlyMetrics
): DerivedMetrics {
  const prevCustomers = previous?.customers ?? current.customers;
  const prevMRR = previous?.mrr ?? current.mrr;

  // Churn rates
  const churnRate =
    prevCustomers > 0
      ? (current.churnedCustomers / prevCustomers) * 100
      : 0;
  const revenueChurnRate =
    prevMRR > 0 ? (current.churnedRevenue / prevMRR) * 100 : 0;

  // Unit economics
  const cac =
    current.newCustomers > 0
      ? Math.round(current.acquisitionSpend / current.newCustomers)
      : 0;

  // LTV = ARPU / monthly churn rate (simplified)
  const monthlyChurn = churnRate / 100 || 0.01; // floor to avoid /0
  const ltv = Math.round(current.arpu / monthlyChurn);

  const ltvCacRatio = cac > 0 ? Math.round((ltv / cac) * 10) / 10 : 0;

  // Growth
  const mrrGrowth =
    prevMRR > 0
      ? Math.round(((current.mrr - prevMRR) / prevMRR) * 1000) / 10
      : 0;

  const arr = current.mrr * 12;

  // CAC payback: months of ARPU to recover acquisition cost
  const cacPaybackMonths =
    current.arpu > 0 ? Math.round((cac / current.arpu) * 10) / 10 : 0;

  return {
    churnRate: Math.round(churnRate * 100) / 100,
    revenueChurnRate: Math.round(revenueChurnRate * 100) / 100,
    cac,
    ltv,
    ltvCacRatio,
    mrrGrowth,
    arr,
    cacPaybackMonths,
  };
}

/** Enrich an array of raw metrics with derived values. */
export function enrichData(raw: MonthlyMetrics[]): DashboardRow[] {
  return raw.map((m, i) => ({
    ...m,
    ...computeDerived(m, i > 0 ? raw[i - 1] : undefined),
  }));
}

/** Filter data by time range. */
export function filterByRange(
  data: DashboardRow[],
  range: TimeRange
): DashboardRow[] {
  if (range === "all") return data;
  const months = parseInt(range, 10);
  return data.slice(-months);
}

/** Compute summary KPIs from enriched data. */
export function computeKPIs(data: DashboardRow[]): KPISummary {
  if (data.length === 0) {
    return {
      currentMRR: 0,
      currentARR: 0,
      avgChurnRate: 0,
      avgLTV: 0,
      avgCAC: 0,
      avgLTVCACRatio: 0,
      totalCustomers: 0,
      mrrGrowthTrend: 0,
    };
  }

  const latest = data[data.length - 1];
  const avg = (arr: number[]) =>
    arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

  // Use last 3 months for trend averages
  const recent = data.slice(-3);

  return {
    currentMRR: latest.mrr,
    currentARR: latest.arr,
    avgChurnRate: Math.round(avg(recent.map((d) => d.churnRate)) * 100) / 100,
    avgLTV: Math.round(avg(recent.map((d) => d.ltv))),
    avgCAC: Math.round(avg(recent.map((d) => d.cac))),
    avgLTVCACRatio:
      Math.round(avg(recent.map((d) => d.ltvCacRatio)) * 10) / 10,
    totalCustomers: latest.customers,
    mrrGrowthTrend:
      Math.round(avg(recent.map((d) => d.mrrGrowth)) * 10) / 10,
  };
}

/** Format a dollar amount with commas. */
export function formatCurrency(value: number): string {
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(1)}K`;
  }
  return `$${value.toLocaleString()}`;
}

/** Format a percentage. */
export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

/** Format a ratio. */
export function formatRatio(value: number): string {
  return `${value.toFixed(1)}x`;
}
