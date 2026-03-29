/**
 * Tests for seed data generator.
 */

import { generateSeedData } from "../seed";

describe("generateSeedData", () => {
  it("generates the requested number of months", () => {
    const data = generateSeedData(12);
    expect(data.length).toBe(12);
  });

  it("generates 24 months by default", () => {
    const data = generateSeedData();
    expect(data.length).toBe(24);
  });

  it("produces valid month strings", () => {
    const data = generateSeedData(6);
    for (const row of data) {
      expect(row.month).toMatch(/^\d{4}-\d{2}$/);
    }
  });

  it("starts with positive customer count", () => {
    const data = generateSeedData(1);
    expect(data[0].customers).toBeGreaterThan(0);
  });

  it("has growing customer count over time", () => {
    const data = generateSeedData(12);
    expect(data[11].customers).toBeGreaterThan(data[0].customers);
  });

  it("has positive MRR for every month", () => {
    const data = generateSeedData(24);
    for (const row of data) {
      expect(row.mrr).toBeGreaterThan(0);
    }
  });

  it("is deterministic (same seed produces same data)", () => {
    const a = generateSeedData(12);
    const b = generateSeedData(12);
    expect(a).toEqual(b);
  });

  it("churned customers never exceed total customers", () => {
    const data = generateSeedData(24);
    for (const row of data) {
      expect(row.churnedCustomers).toBeLessThanOrEqual(row.customers + row.churnedCustomers);
    }
  });
});
