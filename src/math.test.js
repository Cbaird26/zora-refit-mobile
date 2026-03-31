import { describe, it, expect } from "vitest";
import {
  branchProbabilities,
  buildSymmetricFutures,
  timelineBranchProbabilities,
} from "./lib/math.js";

function sum(arr) {
  return arr.reduce((a, b) => a + b, 0);
}

describe("branchProbabilities", () => {
  it("normalizes to a probability vector (sum = 1, all nonnegative)", () => {
    const futures = buildSymmetricFutures(6);
    const { probs } = branchProbabilities({ eta: 0.4, coherence: 0.5, futures });
    expect(probs.every((p) => p >= 0 && p <= 1)).toBe(true);
    expect(sum(probs)).toBeCloseTo(1, 12);
  });

  it("is uniform when η = 0 (symmetric ΔE and equal amplitude)", () => {
    const futures = buildSymmetricFutures(6);
    const { probs } = branchProbabilities({ eta: 0, coherence: 0.7, futures });
    const target = 1 / 6;
    for (const p of probs) {
      expect(p).toBeCloseTo(target, 10);
    }
  });

  it("throws if Z is zero for degenerate inputs", () => {
    expect(() =>
      branchProbabilities({
        eta: 0,
        coherence: 0,
        futures: [{ dE: 0, amp2: 0, angle: 0, label: "x" }],
      }),
    ).toThrow(/invalid partition function/);
  });

  it("favors higher-dE futures when eta is positive", () => {
    const futures = [
      { dE: -1, amp2: 0.5, angle: 0, label: "low" },
      { dE: 1, amp2: 0.5, angle: 0, label: "high" },
    ];
    const { probs } = branchProbabilities({ eta: 0.6, coherence: 0.4, futures });
    expect(probs[1]).toBeGreaterThan(probs[0]);
  });

  it("increases concentration when coherence amplifies a positive tilt", () => {
    const futures = [
      { dE: -1, amp2: 0.5, angle: 0, label: "low" },
      { dE: 1, amp2: 0.5, angle: 0, label: "high" },
    ];
    const weak = branchProbabilities({ eta: 0.4, coherence: 0.0, futures });
    const strong = branchProbabilities({ eta: 0.4, coherence: 1.0, futures });
    expect(strong.probs[1]).toBeGreaterThan(weak.probs[1]);
  });
});

describe("timelineBranchProbabilities", () => {
  const timelines = [
    { name: "A", dE: -0.8, hue: 0 },
    { name: "B", dE: 0.0, hue: 50 },
    { name: "C", dE: 0.8, hue: 180 },
  ];

  it("sums to 1", () => {
    const { probs } = timelineBranchProbabilities({ eta: 0.2, Fi: 0.5, timelines });
    expect(sum(probs)).toBeCloseTo(1, 12);
  });
});
