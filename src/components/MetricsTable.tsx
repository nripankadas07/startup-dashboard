/**
 * Detailed metrics table.
 *
 * A scrollable table showing all raw + derived metrics per month.
 * For founders who want the exact numbers, not just the charts.
 */

import React from "react";
import { DashboardRow } from "../data/types";
import { formatCurrency, formatPercent, formatRatio } from "../utils/metrics";

interface MetricsTableProps {
  data: DashboardRow[];
}

const columns: { key: keyof DashboardRow; label: string; format: (v: number) => string }[] = [
  { key: "month", label: "Month", format: (v) => String(v) },
  { key: "mrr", label: "MRR", format: formatCurrency },
  { key: "arr", label: "ARR", format: formatCurrency },
  { key: "customers", label: "Customers", format: (v) => v.toLocaleString() },
  { key: "newCustomers", label: "New", format: (v) => `+${v}` },
  { key: "churnedCustomers", label: "Churned", format: (v) => `-${v}` },
  { key: "churnRate", label: "Churn %", format: formatPercent },
  { key: "arpu", label: "ARPU", format: formatCurrency },
  { key: "cac", label: "CAC", format: formatCurrency },
  { key: "ltv", label: "LTV", format: formatCurrency },
  { key: "ltvCacRatio", label: "LTV:CAC", format: formatRatio },
  { key: "mrrGrowth", label: "MoM Growth", format: formatPercent },
];

export default function MetricsTable({ data }: MetricsTableProps) {
  return (
    <div style={styles.wrapper}>
      <h3 style={styles.title}>Monthly Detail</h3>
      <div style={styles.scrollContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key} style={styles.th}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.month} style={styles.tr}>
                {columns.map((col) => (
                  <td key={col.key} style={styles.td}>
                    {col.key === "month"
                      ? row.month
                      : col.format(row[col.key] as number)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
  scrollContainer: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: 13,
  },
  th: {
    textAlign: "left" as const,
    padding: "8px 12px",
    borderBottom: "2px solid #e2e8f0",
    color: "#64748b",
    fontWeight: 600,
    whiteSpace: "nowrap" as const,
  },
  tr: {
    borderBottom: "1px solid #f1f5f9",
  },
  td: {
    padding: "8px 12px",
    color: "#334155",
    whiteSpace: "nowrap" as const,
  },
};
