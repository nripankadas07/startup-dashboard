import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Startup Dashboard â SaaS Metrics",
  description:
    "Track MRR, churn, LTV, CAC, and customer growth for your startup.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
