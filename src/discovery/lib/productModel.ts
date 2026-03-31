import { computeFoldCost, computeFoldScoreExtended, distance, generateCandidates } from "./engineCore";
import { computeFoldAperture, computeStability, classifyFold } from "./foldGeometry";
import { computeProbabilities } from "./probabilityField";
import { evaluateConstraints } from "./constraints";
import { mapFields } from "./toeBridge";
import { computeGammaEffective, computeVisibility } from "./h2Test";
import type {
  AutoRouteRecommendation,
  DecisionOption,
  EngineControls,
  PracticalInputs,
  ScenarioEvaluation,
  IntentScenario,
  Vector3,
} from "./types";

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

export const DEFAULT_ETA = 0.3;
export const DEFAULT_ORIGIN: Vector3 = [0, 0, 0];
export const DEFAULT_MANUAL_CONTROLS: EngineControls = {
  energy: 0.5,
  curvature: 0.5,
  coherence: 0.5,
  ethics: 0,
  instability: 0.2,
  eta: DEFAULT_ETA,
  target: [10, 2, -4],
};

export const DEFAULT_DECISION_OPTIONS: DecisionOption[] = [
  {
    id: "option-a",
    name: "Option A",
    inputs: {
      alignment: 0.72,
      complexity: 0.48,
      timeHorizon: 0.4,
      stability: 0.79,
    },
  },
  {
    id: "option-b",
    name: "Option B",
    inputs: {
      alignment: 0.58,
      complexity: 0.66,
      timeHorizon: 0.58,
      stability: 0.63,
    },
  },
  {
    id: "option-c",
    name: "Option C",
    inputs: {
      alignment: 0.96,
      complexity: 0.92,
      timeHorizon: 0.88,
      stability: 0.94,
    },
  },
];

export const DEFAULT_INTENT_SCENARIO: IntentScenario = {
  label: "Target Outcome",
  inputs: {
    alignment: 0.78,
    complexity: 0.56,
    timeHorizon: 0.52,
    stability: 0.84,
  },
};

const AUTO_ROUTE_BLUEPRINTS: Array<{
  id: string;
  name: string;
  rationale: string;
  tune: {
    energy?: number;
    curvature?: number;
    coherence?: number;
    ethics?: number;
    instability?: number;
    eta?: number;
    targetScale?: [number, number, number];
    targetShift?: [number, number, number];
  };
}> = [
  {
    id: "prime-corridor",
    name: "Prime Corridor",
    rationale: "Tightens the corridor by lifting coherence and trimming route length without spiking instability.",
    tune: {
      energy: 0.05,
      curvature: 0.06,
      coherence: 0.08,
      ethics: 0.05,
      instability: -0.08,
      eta: 0.12,
      targetScale: [0.9, 0.55, 0.88],
    },
  },
  {
    id: "vector-lock",
    name: "Vector Lock",
    rationale: "Pulls the route toward the strongest attractor line and compresses lateral wobble for cleaner arrival.",
    tune: {
      energy: 0.02,
      curvature: 0.04,
      coherence: 0.12,
      ethics: 0.08,
      instability: -0.12,
      eta: 0.08,
      targetScale: [0.84, 0.4, 0.82],
    },
  },
  {
    id: "stable-arc",
    name: "Stable Arc",
    rationale: "Favours a calmer, safer bend through the field when you want a steadier corridor over speed.",
    tune: {
      energy: -0.02,
      curvature: 0.1,
      coherence: 0.1,
      ethics: 0.04,
      instability: -0.1,
      eta: 0.05,
      targetScale: [0.86, 0.25, 0.86],
    },
  },
  {
    id: "fast-lane",
    name: "Fast Lane",
    rationale: "Leans into higher energy and bias for speed, trading some safety margin for a sharper corridor.",
    tune: {
      energy: 0.09,
      curvature: 0.02,
      coherence: 0.04,
      ethics: 0.02,
      instability: 0.04,
      eta: 0.18,
      targetScale: [0.98, 0.7, 0.94],
    },
  },
  {
    id: "return-safe",
    name: "Return-Safe Arc",
    rationale: "Optimizes for safer return geometry by reducing instability and keeping the target closer to the basin center.",
    tune: {
      energy: 0.03,
      curvature: 0.08,
      coherence: 0.07,
      ethics: 0.1,
      instability: -0.14,
      eta: 0.02,
      targetScale: [0.82, 0.18, 0.8],
    },
  },
  {
    id: "long-horizon",
    name: "Long Horizon",
    rationale: "Extends the corridor for farther destinations while keeping the field coherent enough to remain viable.",
    tune: {
      energy: 0.04,
      curvature: 0.12,
      coherence: 0.03,
      ethics: 0.02,
      instability: -0.02,
      eta: 0.12,
      targetScale: [1.05, 0.5, 1.04],
    },
  },
];

export function mapPracticalInputsToEngine(inputs: PracticalInputs, eta = DEFAULT_ETA): EngineControls {
  return {
    coherence: clamp(inputs.alignment, 0, 1),
    energy: clamp(0.25 + inputs.complexity * 0.75, 0, 1),
    curvature: clamp(0.2 + inputs.timeHorizon * 0.65, 0, 1),
    ethics: clamp(inputs.alignment * 2 - 1, -1, 1),
    instability: clamp(1 - inputs.stability, 0, 1),
    eta,
    target: deriveTargetFromPracticalInputs(inputs),
  };
}

export function deriveTargetFromPracticalInputs(inputs: PracticalInputs): Vector3 {
  return [
    Number((6 + inputs.complexity * 10).toFixed(2)),
    Number((((inputs.alignment - 0.5) * 10) + (inputs.stability - 0.5) * 4).toFixed(2)),
    Number((-(2 + inputs.timeHorizon * 10)).toFixed(2)),
  ];
}

export function applyEngineOverrides(base: EngineControls, overrides?: Partial<EngineControls>): EngineControls {
  if (!overrides) {
    return base;
  }

  return {
    energy: overrides.energy ?? base.energy,
    curvature: overrides.curvature ?? base.curvature,
    coherence: overrides.coherence ?? base.coherence,
    ethics: overrides.ethics ?? base.ethics,
    instability: overrides.instability ?? base.instability,
    eta: overrides.eta ?? base.eta,
    target: overrides.target ?? base.target,
  };
}

function tuneControls(base: EngineControls, tune: (typeof AUTO_ROUTE_BLUEPRINTS)[number]["tune"]): EngineControls {
  const targetScale = tune.targetScale ?? [1, 1, 1];
  const targetShift = tune.targetShift ?? [0, 0, 0];

  return {
    energy: clamp(base.energy + (tune.energy ?? 0), 0, 1),
    curvature: clamp(base.curvature + (tune.curvature ?? 0), 0, 1),
    coherence: clamp(base.coherence + (tune.coherence ?? 0), 0, 1),
    ethics: clamp(base.ethics + (tune.ethics ?? 0), -1, 1),
    instability: clamp(base.instability + (tune.instability ?? 0), 0, 1),
    eta: clamp(base.eta + (tune.eta ?? 0), -1.5, 1.5),
    target: [
      Number((base.target[0] * targetScale[0] + targetShift[0]).toFixed(2)),
      Number((base.target[1] * targetScale[1] + targetShift[1]).toFixed(2)),
      Number((base.target[2] * targetScale[2] + targetShift[2]).toFixed(2)),
    ],
  };
}

export function getEngineStatus(foldScore: number, riskScore: number, topologyStable: boolean, returnPathAvailable: boolean) {
  if (!topologyStable || riskScore >= 0.78) {
    return "Reconfigure";
  }
  if (foldScore >= 0.74 && returnPathAvailable) {
    return "Aligned";
  }
  if (foldScore >= 0.48) {
    return "Possible";
  }
  return "Low Alignment";
}

export function generateInsight({
  foldScore,
  stability,
  riskScore,
  constraints,
}: {
  foldScore: number;
  stability: number;
  riskScore: number;
  constraints: {
    topologyStable: boolean;
    returnPathAvailable: boolean;
  };
}) {
  if (!constraints.topologyStable || riskScore >= 0.75) {
    return "Current conditions are not aligned yet. Reduce instability or simplify the path before proceeding.";
  }
  if (foldScore >= 0.72 && stability >= 0.55 && constraints.returnPathAvailable) {
    return "Conditions are aligned. This path is viable under the current constraints.";
  }
  if (foldScore >= 0.5) {
    return "This path is possible, but it will benefit from stronger stability before you rely on it.";
  }
  return "Viability is limited right now. Increase alignment or lower complexity to improve the path.";
}

export function evaluateEngineControls(label: string, controls: EngineControls, practicalInputs?: PracticalInputs, origin: Vector3 = DEFAULT_ORIGIN): ScenarioEvaluation {
  const targetDistance = distance(origin, controls.target);
  const candidates = computeProbabilities(
    generateCandidates(controls.target, 24).map((candidate) => {
      const candidateDistance = distance(origin, candidate.offset);
      return {
        amp2: 1 / 24,
        dE: -computeFoldCost({
          distance: candidateDistance,
          curvature: controls.curvature,
          energy: controls.energy,
          coherence: controls.coherence,
          instability: controls.instability,
        }),
        data: {
          offset: candidate.offset,
          cost: computeFoldCost({
            distance: candidateDistance,
            curvature: controls.curvature,
            energy: controls.energy,
            coherence: controls.coherence,
            instability: controls.instability,
          }),
        },
      };
    }),
    controls.eta,
  ).sort((left, right) => right.p - left.p);

  const chosen = candidates[0];
  const foldScore = computeFoldScoreExtended(controls);
  const aperture = computeFoldAperture(foldScore, controls.coherence);
  const stability = computeStability(foldScore, controls.instability);
  const constraints = evaluateConstraints({
    energy: controls.energy,
    curvature: controls.curvature,
    coherence: controls.coherence,
    instability: controls.instability,
    distance: targetDistance,
  });
  const gammaEff = computeGammaEffective({
    instability: controls.instability,
    coherence: controls.coherence,
    aperture,
  });
  const visibility = computeVisibility({ Gamma: gammaEff, T: 1e-6, dx: aperture * 1e-3 });
  const fields = mapFields({ coherence: controls.coherence, ethics: controls.ethics });
  const engineStatus = getEngineStatus(foldScore, constraints.riskScore, constraints.topologyStable, constraints.returnPathAvailable);
  const decisionScore = foldScore * 0.75 + stability * 0.15 + (1 - constraints.riskScore) * 0.1;

  return {
    label,
    practicalInputs,
    params: controls,
    aperture,
    chosenCost: chosen?.data.cost ?? targetDistance,
    chosenProbability: chosen?.p ?? 0,
    chosenTarget: chosen?.data.offset ?? controls.target,
    constraints,
    decisionScore,
    engineStatus,
    fields,
    foldClass: classifyFold(foldScore),
    foldScore,
    gammaEff,
    insight: generateInsight({
      foldScore,
      stability,
      riskScore: constraints.riskScore,
      constraints,
    }),
    stability,
    targetDistance,
    visibility,
  };
}

export function evaluateIntentScenario(intent: IntentScenario) {
  const mapped = mapPracticalInputsToEngine(intent.inputs, intent.overrides?.eta ?? DEFAULT_ETA);
  return evaluateEngineControls(intent.label, applyEngineOverrides(mapped, intent.overrides), intent.inputs);
}

export function evaluateDecisionOptions(options: DecisionOption[]) {
  const evaluations = options.map((option) => {
    const mapped = mapPracticalInputsToEngine(option.inputs, option.overrides?.eta ?? DEFAULT_ETA);
    return {
      id: option.id,
      name: option.name,
      evaluation: evaluateEngineControls(option.name, applyEngineOverrides(mapped, option.overrides), option.inputs),
    };
  });

  return evaluations.sort((left, right) => right.evaluation.decisionScore - left.evaluation.decisionScore);
}

export function evaluateAutoRoutes(controls: EngineControls): AutoRouteRecommendation[] {
  const baseline = evaluateEngineControls("Navigator Baseline", controls);

  return AUTO_ROUTE_BLUEPRINTS.map((route) => {
    const routeControls = tuneControls(controls, route.tune);
    const evaluation = evaluateEngineControls(route.name, routeControls);

    return {
      id: route.id,
      name: route.name,
      rationale: route.rationale,
      controls: routeControls,
      evaluation,
      deltas: {
        foldScore: evaluation.foldScore - baseline.foldScore,
        chosenCost: baseline.chosenCost - evaluation.chosenCost,
        riskScore: baseline.constraints.riskScore - evaluation.constraints.riskScore,
        chosenProbability: evaluation.chosenProbability - baseline.chosenProbability,
        targetDistance: baseline.targetDistance - evaluation.targetDistance,
      },
    };
  }).sort((left, right) => {
    if (right.evaluation.decisionScore !== left.evaluation.decisionScore) {
      return right.evaluation.decisionScore - left.evaluation.decisionScore;
    }

    if (right.deltas.chosenProbability !== left.deltas.chosenProbability) {
      return right.deltas.chosenProbability - left.deltas.chosenProbability;
    }

    return right.deltas.chosenCost - left.deltas.chosenCost;
  });
}
