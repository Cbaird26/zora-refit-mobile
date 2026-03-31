import type { PersistedProductState } from "./types";
import { loadStoredString, saveStoredString } from "../../platform/storage";

export const PRODUCT_STATE_STORAGE_KEY = "zora-refit-product-state";
const VALID_MODES = new Set(["DECISION", "INTENT", "NAVIGATION", "AUTOPILOT", "RESEARCH"]);
const VALID_HOLD_MODES = new Set(["ARRIVAL", "INDEFINITE"]);

export function serializePersistedProductState(state: PersistedProductState) {
  return JSON.stringify(state);
}

export function deserializePersistedProductState(raw: string | null) {
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<PersistedProductState>;

    if (
      !parsed ||
      typeof parsed !== "object" ||
      typeof parsed.mode !== "string" ||
      !VALID_MODES.has(parsed.mode) ||
      !Array.isArray(parsed.decisionOptions) ||
      typeof parsed.selectedDecisionId !== "string" ||
      !parsed.intentScenario ||
      typeof parsed.coherenceHoldMode !== "string" ||
      !VALID_HOLD_MODES.has(parsed.coherenceHoldMode) ||
      !parsed.advancedOpen
    ) {
      return null;
    }

    return parsed as PersistedProductState;
  } catch {
    return null;
  }
}

export function loadPersistedProductState() {
  return loadStoredString(PRODUCT_STATE_STORAGE_KEY).then((raw) => deserializePersistedProductState(raw));
}

export function savePersistedProductState(state: PersistedProductState) {
  return saveStoredString(PRODUCT_STATE_STORAGE_KEY, serializePersistedProductState(state));
}
