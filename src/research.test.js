import { describe, expect, it } from "vitest";
import {
  classifyFold,
  computeFoldAperture,
  computeFoldScore,
} from "./lib/foldScore.js";
import { evaluateConstraints } from "./lib/constraints.js";
import { computeGammaEffective, computeVisibility } from "./lib/visibility.js";

describe("computeFoldScore", () => {
  it("stays within [0, 1]", () => {
    expect(
      computeFoldScore({
        curvature: 5,
        energy: 5,
        coherence: 1,
        ethics: 1,
        instability: 0,
      }),
    ).toBe(1);

    expect(
      computeFoldScore({
        curvature: 0,
        energy: 0,
        coherence: 0,
        ethics: -1,
        instability: 1,
      }),
    ).toBe(0);
  });

  it("rewards coherent ethical coupling", () => {
    const weak = computeFoldScore({
      curvature: 0.5,
      energy: 0.5,
      coherence: 0.2,
      ethics: 0.8,
      instability: 0.2,
    });
    const strong = computeFoldScore({
      curvature: 0.5,
      energy: 0.5,
      coherence: 0.8,
      ethics: 0.8,
      instability: 0.2,
    });

    expect(strong).toBeGreaterThan(weak);
  });

  it("classifies fold bands consistently", () => {
    expect(classifyFold(0.1)).toBe("NO FOLD");
    expect(classifyFold(0.5)).toBe("LOCAL DISTORTION");
    expect(classifyFold(0.7)).toBe("STABLE CORRIDOR");
    expect(classifyFold(0.95)).toBe("FULL FOLD");
    expect(computeFoldAperture(0.8, 0.5)).toBeCloseTo(0.4, 12);
  });
});

describe("evaluateConstraints", () => {
  it("reports stable low-risk conditions", () => {
    const report = evaluateConstraints({
      energy: 0.8,
      curvature: 0.8,
      coherence: 0.7,
      instability: 0.2,
      distance: 0.4,
    });

    expect(report.causalitySafe).toBe(true);
    expect(report.energyBudgetPass).toBe(true);
    expect(report.coherenceWindowPass).toBe(true);
    expect(report.topologyStable).toBe(true);
    expect(report.returnPathAvailable).toBe(true);
    expect(report.riskScore).toBeGreaterThanOrEqual(0);
    expect(report.riskScore).toBeLessThanOrEqual(1);
  });
});

describe("visibility mapping", () => {
  it("drops visibility as instability and eta rise", () => {
    const lowGamma = computeGammaEffective({
      instability: 0.1,
      coherence: 0.8,
      aperture: 0.2,
      eta: 0.1,
    });
    const highGamma = computeGammaEffective({
      instability: 0.6,
      coherence: 0.4,
      aperture: 0.8,
      eta: 0.8,
    });

    const highVisibility = computeVisibility({ Gamma: lowGamma, T: 1e-6, dx: 1e-3 });
    const lowVisibility = computeVisibility({ Gamma: highGamma, T: 1e-6, dx: 1e-3 });

    expect(highGamma).toBeGreaterThan(lowGamma);
    expect(lowVisibility).toBeLessThan(highVisibility);
  });
});
