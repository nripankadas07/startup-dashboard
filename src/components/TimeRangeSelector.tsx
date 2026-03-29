/**
 * Time range filter toggle.
 *
 * Lets the user switch between 3-month, 6-month, 12-month,
 * and all-time views of the metrics.
 */

import React from "react";
import { TimeRange } from "../data/types";

interface TimeRangeSelectorProps {
  value: TimeRange;
  onChange: (range: TimeRange) => void;
}

const options: { value: TimeRange; label: string }[] = [
  { value: "3m", label: "3M" },
  { value: "6m", label: "6M" },
  { value: "12m", label: "12M" },
  { value: "all", label: "All" },
];

export default function TimeRangeSelector({
  value,
  onChange,
}: TimeRangeSelectorProps) {
  return (
    <div style={styles.container}>
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          style={{
            ...styles.button,
            ...(value === opt.value ? styles.active : {}),
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: "flex",
    gap: 4,
    background: "#f1f5f9",
    borderRadius: 8,
    padding: 4,
  },
  button: {
    padding: "6px 14px",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 500,
    color: "#64748b",
    background: "transparent",
    transition: "all 0.15s ease",
  },
  active: {
    background: "#ffffff",
    color: "#0f172a",
    boxShadow: "0 1px 2px rgba(0,0,0,0.08)",
  },
};
