/**
 * KPI summary card.
 *
 * Displays a single headline metric with label, value, and
 * optional trend indicator. Used in the top row of the dashboard.
 */

import React from "react";

interface KPICardProps {
  label: string;
  value: string;
  subtitle?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
}

const trendColors = {
  up: "#22c55e",
  down: "#ef4444",
  neutral: "#94a3b8",
};

const trendArrows = {
  up: "\u2191",
  down: "\u2193",
  neutral: "\u2192",
};

export default function KPICard({
  label,
  value,
  subtitle,
  trend = "neutral",
  trendValue,
}: KPICardProps) {
  return (
    <div style={styles.card}>
      <span style={styles.label}>{label}</span>
      <span style={styles.value}>{value}</span>
      <div style={styles.footer}>
        {trendValue && (
          <span style={{ ...styles.trend, color: trendColors[trend] }}>
            {trendArrows[trend]} {trendValue}
          </span>
        )}
        {subtitle && <span style={styles.subtitle}>{subtitle}</span>}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    background: "#ffffff",
    borderRadius: 12,
    padding: "20px 24px",
    display: "flex",
    flexDirection: "column",
    gap: 4,
    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
    border: "1px solid #e2e8f0",
    minWidth: 160,
  },
  label: {
    fontSize: 13,
    fontWeight: 500,
    color: "#64748b",
    textTransform: "uppercase" as const,
    letterSpacing: "0.05em",
  },
  value: {
    fontSize: 28,
    fontWeight: 700,
    color: "#0f172a",
  },
  footer: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
  },
  trend: {
    fontSize: 13,
    fontWeight: 600,
  },
  subtitle: {
    fontSize: 12,
    color: "#94a3b8",
  },
};
