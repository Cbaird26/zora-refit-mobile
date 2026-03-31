import { describe, expect, it } from "vitest";
import { deserializeShellState, normalizeMobileSettings } from "./settings";

describe("mobile settings", () => {
  it("normalizes missing settings to safe defaults", () => {
    const settings = normalizeMobileSettings();
    expect(settings.safeMode).toBe(true);
    expect(settings.brightnessEffectsEnabled).toBe(false);
    expect(settings.hapticsEnabled).toBe(true);
  });

  it("restores valid shell state payloads", () => {
    const restored = deserializeShellState(
      JSON.stringify({
        activeDeviceId: "fold",
        settings: {
          safeMode: false,
          reducedMotion: true,
          hapticsEnabled: false,
          brightnessEffectsEnabled: true,
          onboardingCompleted: true,
        },
      }),
      "sculptor",
    );

    expect(restored?.activeDeviceId).toBe("fold");
    expect(restored?.settings.safeMode).toBe(false);
    expect(restored?.settings.brightnessEffectsEnabled).toBe(true);
  });
});
