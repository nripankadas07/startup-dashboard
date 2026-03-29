/**
 * Seed data generator for the dashboard demo.
 *
 * Simulates 24 months of realistic SaaS growth â starting small,
 * with natural variance in acquisition, churn, and spend. The
 * numbers follow a plausible early-stage trajectory: quick initial
 * growth that gradually stabilises.
 */

import { MonthlyMetrics } from "./types";

/** Deterministic pseudo-random based on a seed string. */
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/** Generate `count` months of synthetic SaaS data. */
export function generateSeedData(count: number = 24): MonthlyMetrics[] {
  const rand = seededRandom(42);
  const data: MonthlyMetrics[] = [];

  let customers = 12;
  let baseARPU = 49;

  const startDate = new Date(2024, 0); // Jan 2024

  for (let i = 0; i < count; i++) {
    const date = new Date(startDate.getFullYear(), startDate.getMonth() + i);
    const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

    // Growth rate decays over time (fast early, slower later)
    const growthFactor = 1 + 0.15 * Math.exp(-i / 12);
    const noise = 0.8 + rand() * 0.4; // 80%-120% variance

    const newCustomers = Math.max(
      1,
      Math.round(customers * (growthFactor - 1) * noise + 3)
    );

    // Churn: 3-8% of customers, trending down as product matures
    const churnPct = 0.03 + 0.05 * Math.exp(-i / 10);
    const churnedCustomers = Math.max(
      0,
      Math.round(customers * churnPct * (0.7 + rand() * 0.6))
    );

    customers = customers + newCustomers - churnedCustomers;

    // ARPU grows slightly (upsells, pricing changes)
    baseARPU *= 1 + 0.005 * (0.5 + rand());
    const arpu = Math.round(baseARPU * 100) / 100;
    const mrr = Math.round(customers * arpu);

    const churnedRevenue = Math.round(churnedCustomers * arpu);

    // CAC: $150-300 range, improving over time
    const baseCACMultiplier = 250 - i * 3;
    const acquisitionSpend = Math.round(
      newCustomers * baseCACMultiplier * (0.85 + rand() * 0.3)
    );

    data.push({
      month,
      mrr,
      customers,
      newCustomers,
      churnedCustomers,
      churnedRevenue,
      acquisitionSpend,
      arpu,
    });
  }

  return data;
}
