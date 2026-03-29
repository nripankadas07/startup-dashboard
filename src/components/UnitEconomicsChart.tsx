/**
 * Unit economics bar chart.
 *
 * Shows CAC vs LTV side by side â the metrics that tell you
 * whether your growth engine is sustainable. A healthy business
 * has LTV significantly exceeding CAC (ideally 3x+).
 */

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { DashboardRow } from "../data/types";
import { formatCurrency } from "../utils/metrics";

interface UnitEconomicsChartProps {
  data: DashboardRow[];
}

export default function UnitEconomicsChart({ data }: UnitEconomicsChartProps) {
  return (
    <div style={styles.wrapper}>
      <h3 style={styles.title}>Unit Economics: LTV vs CAC</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 12, fill: "#94a3b8" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fill: "#94a3b8" }}
            tickFormatter={(v) => formatCurrency(v)}
            tickLine={false}
          />
          <Tooltip
            formatter={(value: number, name: string) => [
              formatCurrency(value),
              name === "ltv" ? "LTV" : "CAC",
            ]}
            contentStyle={styles.tooltip}
          />
          <Legend formatter={(value) => (value === "ltv" ? "LTV" : "CAC")} />
          <Bar dataKey="ltv" fill="#22c55e" radius={[4, 4, 0, 0]} />
          <Bar dataKey="cac" fill="#6366f1" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    background: "#ffffff",
    borderRadius: 12,
    padding: 24,
    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
    border: "1px solid #e2e8f0",
  },
  title: {
    fontSize: 16,
    fontWeight: 600,
    color: "#0f172a",
    marginBottom: 16,
    marginTop: 0,
  },
  tooltip: {
    borderRadius: 8,
    border: "1px solid #e2e8f0",
    boxShadow: "0 4px 6px rgba(0,0,0,0.07)",
  },
};
