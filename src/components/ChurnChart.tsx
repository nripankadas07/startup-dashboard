/**
 * Churn rate line chart.
 *
 * Tracks customer churn and revenue churn side by side.
 * Healthy SaaS companies aim to drive both lines down over time.
 */

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { DashboardRow } from "../data/types";
import { formatPercent } from "../utils/metrics";

interface ChurnChartProps {
  data: DashboardRow[];
}

export default function ChurnChart({ data }: ChurnChartProps) {
  return (
    <div style={styles.wrapper}>
      <h3 style={styles.title}>Churn Rates</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 12, fill: "#94a3b8" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fill: "#94a3b8" }}
            tickFormatter={(v) => `${v}%`}
            tickLine={false}
          />
          <Tooltip
            formatter={(value: number, name: string) => [
              formatPercent(value),
              name === "churnRate" ? "Customer Churn" : "Revenue Churn",
            ]}
            contentStyle={styles.tooltip}
          />
          <Legend
            formatter={(value) =>
              value === "churnRate" ? "Customer Churn" : "Revenue Churn"
            }
          />
          <Line
            type="monotone"
            dataKey="churnRate"
            stroke="#ef4444"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="revenueChurnRate"
            stroke="#f97316"
            strokeWidth={2}
            dot={false}
            strokeDasharray="5 5"
          />
        </LineChart>
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
