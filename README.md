# startup-dashboard

A SaaS metrics dashboard that tracks the numbers every founder obsesses over: MRR, churn, LTV, CAC, and customer growth. Built with Next.js, TypeScript, and Recharts.

## Why This Exists

Early-stage startups need a clear view of their unit economics without paying for expensive analytics tools. This dashboard computes and visualises the core metrics from raw monthly data â the same numbers a Series A investor will ask about.

## What It Tracks

- **MRR & ARR** â Monthly and annualised recurring revenue with growth trends
- **Churn** â Customer churn rate and revenue churn rate over time
- **Unit Economics** â Customer Acquisition Cost (CAC), Lifetime Value (LTV), and the LTV:CAC ratio
- **Customer Growth** â New customers vs churned customers, net growth per month
- **CAC Payback** â How many months of revenue to recover acquisition spend

## Screenshot

```
ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
â  Startup Dashboard                          [3M][6M][12M]â
ââââââââ¬âââââââ¬âââââââ¬âââââââ¬âââââââ¬âââââââ¬âââââââââââââââââ¤
â MRR  â ARR  â Cust âChurn â LTV  â CAC  â LTV:CAC        â
â$52K  â$624K â 520  â3.2%  â$1.6K â$198  â 8.1x           â
ââââââââ´âââââââ´âââââââ´âââââââ´âââââââ´âââââââ´âââââââââââââââââ¤
â  [MRR Area Chart]         â  [Churn Line Chart]          â
â  ââââââââ                â  ââââââââ                    â
âââââââââââââââââââââââââââââ¼âââââââââââââââââââââââââââââââ¤
â  [LTV vs CAC Bars]        â  [Customer Growth Bars]      â
â  ââ ââ ââ ââ              â  ââ ââ ââ ââ                â
âââââââââââââââââââââââââââââ´âââââââââââââââââââââââââââââââ¤
â  Month  MRR    ARR    Cust  New  Churned  Churn%  ARPU   â
â  2024-01 ...                                              â
ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
```

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Architecture

```
src/
âââ app/                    # Next.js app router
â   âââ layout.tsx
â   âââ globals.css
â   âââ page.tsx
âââ components/
â   âââ Dashboard.tsx       # Main layout â composes everything
â   âââ KPICard.tsx         # Summary metric cards
â   âââ TimeRangeSelector.tsx
â   âââ MRRChart.tsx        # Revenue area chart
â   âââ ChurnChart.tsx      # Churn rate lines
â   âââ UnitEconomicsChart.tsx  # LTV vs CAC bars
â   âââ CustomerGrowthChart.tsx # New vs churned bars
â   âââ MetricsTable.tsx    # Full monthly detail table
âââ data/
â   âââ types.ts            # Domain types (MonthlyMetrics, DerivedMetrics, etc.)
â   âââ seed.ts             # Deterministic synthetic data generator
âââ hooks/
â   âââ useDashboard.ts     # State management: seed â enrich â filter â KPIs
âââ utils/
    âââ metrics.ts          # Pure computation: churn, CAC, LTV, formatting
```

## Metrics Definitions

| Metric | Formula |
|--------|---------|
| Customer Churn Rate | churned_customers / previous_customers |
| Revenue Churn Rate | churned_revenue / previous_MRR |
| CAC | acquisition_spend / new_customers |
| LTV | ARPU / monthly_churn_rate |
| LTV:CAC Ratio | LTV / CAC (healthy > 3x) |
| CAC Payback | CAC / ARPU (in months) |
| MRR Growth | (current_MRR - previous_MRR) / previous_MRR |

## Testing

```bash
npm test
```

Tests cover the metrics computation engine and seed data generator â the business logic that needs to be correct.

## Tech Stack

- **Next.js 14** â React framework with App Router
- **TypeScript** â Strict mode throughout
- **Recharts** â Composable chart components
- **date-fns** â Date utilities

## License

MIT
