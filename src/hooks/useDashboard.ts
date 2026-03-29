/**
 * Dashboard state hook.
 *
 * Manages the full data pipeline: seed â enrich â filter â KPIs.
 * React components consume this hook and get everything they need.
 */

import { useMemo, useState } from "react";
import { generateSeedData } from "../data/seed";
import { enrichData, filterByRange, computeKPIs } from "../utils/metrics";
import { DashboardRow, KPISummary, TimeRange } from "../data/types";

interface DashboardState {
  data: DashboardRow[];
  kpis: KPISummary;
  range: TimeRange;
  setRange: (range: TimeRange) => void;
}

export function useDashboard(): DashboardState {
  const [range, setRange] = useState<TimeRange>("12m");

  const allData = useMemo(() => {
    const raw = generateSeedData(24);
    return enrichData(raw);
  }, []);

  const data = useMemo(() => filterByRange(allData, range), [allData, range]);
  const kpis = useMemo(() => computeKPIs(data), [data]);

  return { data, kpis, range, setRange };
}
