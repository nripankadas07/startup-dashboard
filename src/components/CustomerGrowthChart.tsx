/**
 * Customer growth stacked bar chart.
 *
 * Visualises net customer movement each month: new customers
 * gained vs customers churned. The net growth is what drives
 * everything else.
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
  ReferenceLine,
} from "recharts";
import { DashboardRow } from "../data/types";

interface CustomerGrowthChartProps {
  data: DashboardRow[];
}

export default function CustomerGrowthChart({ data }: CustomerGrowthChartProps) {
  const chartData = data.map((d) => ({
    month: d.month,
    new: d.newCustomers,
    churned: -d.churnedCustomers,
    net: d.newCustomers - d.churnedCustomers,
  }));

  return (
    <div style={styles.wrapper}>
      <h3 style={styles.title}>Customer Growth</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 12, fill: "#94a3b8" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fill: "#94a3b8" }}
            tickLine={false}
          />
          <Tooltip contentStyle={styles.tooltip} />
          <Legend />
          <ReferenceLine y={0} stroke="#cbd5e1" />
          <Bar
            dataKey="new"
            name="New"
            fill="#22c55e"
            radius={[4, 4, 0, 0]}
            stackId="stack"
          />
          <Bar
            dataKey="churned"
            name="Churned"
            fill="#ef4444"
            radius={[0, 0, 4, 4]}
            stackId="stack"
          />
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
