/**
 * Tests for the metrics computation engine.
 *
 * Validates that derived KPIs (churn, CAC, LTV, etc.) are
 * computed correctly from raw monthly data.
 */

import {
  computeDerived,
  enrichData,
  filterByRange,
  computeKPIs,
  formatCurrency,
  formatPercent,
  formatRatio,
} from "../metrics";
import { MonthlyMetrics, DashboardRow } from "../../data/types";

// ââ Fixtures ââââââââââââââââââââââââââââââââââââââââââââââ

const baseMonth: MonthlyMetrics = {
  month: "2024-06",
  mrr: 10000,
  customers: 100,
  newCustomers: 15,
  churnedCustomers: 5,
  churnedRevenue: 500,
  acquisitionSpend: 3000,
  arpu: 100,
};

const previousMonth: MonthlyMetrics = {
  month: "2024-05",
  mrr: 9000,
  customers: 90,
  newCustomers: 12,
  churnedCustomers: 3,
  churnedRevenue: 300,
  acquisitionSpend: 2400,
  arpu: 100,
};

// ââ computeDerived ââââââââââââââââââââââââââââââââââââââââ

describe("computeDerived", () => {
  it("computes churn rate from previous customers", () => {
    const derived = computeDerived(baseMonth, previousMonth);
    // 5 churned / 90 previous = 5.56%
    expect(derived.churnRate).toBeCloseTo(5.56, 1);
  });

  it("computes revenue churn rate from previous MRR", () => {
    const derived = computeDerived(baseMonth, previousMonth);
    // 500 / 9000 = 5.56%
    expect(derived.revenueChurnRate).toBeCloseTo(5.56, 1);
  });

  it("computes CAC as spend / new customers", () => {
    const derived = computeDerived(baseMonth, previousMonth);
    // 3000 / 15 = 200
    expect(derived.cac).toBe(200);
  });

  it("computes ARR as MRR * 12", () => {
    const derived = computeDerived(baseMonth, previousMonth);
    expect(derived.arr).toBe(120000);
  });

  it("computes MRR growth", () => {
    const derived = computeDerived(baseMonth, previousMonth);
    // (10000 - 9000) / 9000 = 11.1%
    expect(derived.mrrGrowth).toBeCloseTo(11.1, 0);
  });

  it("computes LTV from ARPU and churn rate", () => {
    const derived = computeDerived(baseMonth, previousMonth);
    // LTV = ARPU / monthly_churn = 100 / 0.0556 ~ 1800
    expect(derived.ltv).toBeGreaterThan(1000);
  });

  it("handles zero previous customers gracefully", () => {
    const derived = computeDerived(baseMonth);
    expect(derived.churnRate).toBeGreaterThanOrEqual(0);
  });

  it("handles zero new customers gracefully", () => {
    const noNewCustomers = { ...baseMonth, newCustomers: 0 };
    const derived = computeDerived(noNewCustomers, previousMonth);
    expect(derived.cac).toBe(0);
  });
});

// ââ enrichData ââââââââââââââââââââââââââââââââââââââââââââ

describe("enrichData", () => {
  it("returns same length as input", () => {
    const raw = [previousMonth, baseMonth];
    const enriched = enrichData(raw);
    expect(enriched.length).toBe(2);
  });

  it("adds derived fields to each row", () => {
    const raw = [previousMonth, baseMonth];
    const enriched = enrichData(raw);
    expect(enriched[1]).toHaveProperty("churnRate");
    expect(enriched[1]).toHaveProperty("cac");
    expect(enriched[1]).toHaveProperty("ltv");
    expect(enriched[1]).toHaveProperty("arr");
  });
});

// ââ filterByRange âââââââââââââââââââââââââââââââââââââââââ

describe("filterByRange", () => {
  const rows: DashboardRow[] = Array.from({ length: 12 }, (_, i) => ({
    ...baseMonth,
    ...computeDerived(baseMonth, previousMonth),
    month: `2024-${String(i + 1).padStart(2, "0")}`,
  }));

  it("returns last 3 months for '3m'", () => {
    expect(filterByRange(rows, "3m").length).toBe(3);
  });

  it("returns last 6 months for '6m'", () => {
    expect(filterByRange(rows, "6m").length).toBe(6);
  });

  it("returns all data for 'all'", () => {
    expect(filterByRange(rows, "all").length).toBe(12);
  });
});

// ââ computeKPIs âââââââââââââââââââââââââââââââââââââââââââ

describe("computeKPIs", () => {
  const rows: DashboardRow[] = Array.from({ length: 6 }, (_, i) => ({
    ...baseMonth,
    ...computeDerived(baseMonth, previousMonth),
    month: `2024-${String(i + 1).padStart(2, "0")}`,
  }));

  it("returns current MRR from latest row", () => {
    const kpis = computeKPIs(rows);
    expect(kpis.currentMRR).toBe(10000);
  });

  it("returns total customers from latest row", () => {
    const kpis = computeKPIs(rows);
    expect(kpis.totalCustomers).toBe(100);
  });

  it("handles empty data", () => {
    const kpis = computeKPIs([]);
    expect(kpis.currentMRR).toBe(0);
    expect(kpis.totalCustomers).toBe(0);
  });
});

// ââ formatters ââââââââââââââââââââââââââââââââââââââââââââ

describe("formatters", () => {
  it("formats currency with K suffix", () => {
    expect(formatCurrency(5400)).toBe("$5.4K");
  });

  it("formats currency with M suffix", () => {
    expect(formatCurrency(1_200_000)).toBe("$1.2M");
  });

  it("formats small currency without suffix", () => {
    expect(formatCurrency(42)).toBe("$42");
  });

  it("formats percent", () => {
    expect(formatPercent(5.55)).toBe("5.6%");
  });

  it("formats ratio", () => {
    expect(formatRatio(3.7)).toBe("3.7x");
  });
});
