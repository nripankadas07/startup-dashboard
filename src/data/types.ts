/**
 * Core domain types for SaaS metrics.
 *
 * These types model the essential data structures a startup
 * founder or operator needs to track business health.
 */

/** A single monthly snapshot of key SaaS metrics. */
export interface MonthlyMetrics {
  /** ISO month string, e.g. "2025-01" */
  month: string;
  /** Monthly Recurring Revenue in dollars */
  mrr: number;
  /** Number of paying customers */
  customers: number;
  /** New customers acquired this month */
  newCustomers: number;
  /** Customers lost this month */
  churnedCustomers: number;
  /** Revenue lost from churned customers */
  churnedRevenue: number;
  /** Total marketing + sales spend */
  acquisitionSpend: number;
  /** Average Revenue Per User */
  arpu: number;
}

/** Computed metrics derived from raw monthly data. */
export interface DerivedMetrics {
  /** Customer churn rate (%) */
  churnRate: number;
  /** Revenue churn rate (%) */
  revenueChurnRate: number;
  /** Customer Acquisition Cost */
  cac: number;
  /** Customer Lifetime Value */
  ltv: number;
  /** LTV:CAC ratio — healthy is > 3 */
  ltvCacRatio: number;
  /** Month-over-month MRR growth (%) */
  mrrGrowth: number;
  /** Annual Recurring Revenue */
  arr: number;
  /** Months to recover CAC */
  cacPaybackMonths: number;
}

/** Combined raw + derived metrics for a single month. */
export interface DashboardRow extends MonthlyMetrics, DerivedMetrics {}

/** Summary KPIs shown at the top of the dashboard. */
export interface KPISummary {
  currentMRR: number;
  currentARR: number;
  avgChurnRate: number;
  avgLTV: number;
  avgCAC: number;
  avgLTVCACRatio: number;
  totalCustomers: number;
  mrrGrowthTrend: number;
}

/** Time range filter options. */
export type TimeRange = "3m" | "6m" | "12m" | "all";
