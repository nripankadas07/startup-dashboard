/**
 * MRR + ARR area chart.
 *
 * The hero chart of any SaaS dashboard â shows monthly recurring
 * revenue growth over time with an area fill for visual impact.
 */

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { DashboardRow } from "../data/types";
import { formatCurrency } from "../utils/metrics";

interface MRRChartProps {
  data: DashboardRow[];
}

export default function MRRChart({ data }: MRRChartProps) {
  return (
    <div style={styles.wrapper}>
      <h3 style={styles.title}>Monthly Recurring Revenue</h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
          <defs>
            <linearGradient id="mrrGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
          </defs>
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
            formatter={(value: number) => [formatCurrency(value), "MRR"]}
            contentStyle={styles.tooltip}
          />
          <Area
            type="monotone"
            dataKey="mrr"
            stroke="#6366f1"
            strokeWidth={2}
            fill="url(#mrrGradient)"
          />
        </AreaChart>
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
