import type { MobileSettings, PersistedShellState } from "./types";
import { getPrefersReducedMotion } from "./runtime";

export const SHELL_STATE_STORAGE_KEY = "zora-refit-shell-state";

export function getDefaultMobileSettings(): MobileSettings {
  const prefersReducedMotion = getPrefersReducedMotion();

  return {
    safeMode: true,
    reducedMotion: prefersReducedMotion,
    hapticsEnabled: true,
    brightnessEffectsEnabled: false,
    onboardingCompleted: false,
  };
}

export function normalizeMobileSettings(value?: Partial<MobileSettings> | null): MobileSettings {
  const defaults = getDefaultMobileSettings();

  return {
    safeMode: value?.safeMode ?? defaults.safeMode,
    reducedMotion: value?.reducedMotion ?? defaults.reducedMotion,
    hapticsEnabled: value?.hapticsEnabled ?? defaults.hapticsEnabled,
    brightnessEffectsEnabled: value?.brightnessEffectsEnabled ?? defaults.brightnessEffectsEnabled,
    onboardingCompleted: value?.onboardingCompleted ?? defaults.onboardingCompleted,
  };
}

export function serializeShellState(state: PersistedShellState) {
  return JSON.stringify(state);
}

export function deserializeShellState(raw: string | null, defaultDeviceId: string): PersistedShellState | null {
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<PersistedShellState>;
    if (!parsed || typeof parsed !== "object" || typeof parsed.activeDeviceId !== "string") {
      return null;
    }

    return {
      activeDeviceId: parsed.activeDeviceId || defaultDeviceId,
      settings: normalizeMobileSettings(parsed.settings),
    };
  } catch {
    return null;
  }
}
