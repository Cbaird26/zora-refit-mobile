import { describe, expect, it } from "vitest";
import { resolveShellBackAction } from "./back";

describe("shell back action resolver", () => {
  it("prioritizes closing overlays before leaving the current tab", () => {
    expect(
      resolveShellBackAction({
        activeDeviceId: "decision",
        defaultDeviceId: "sculptor",
        settingsOpen: true,
        onboardingVisible: false,
        hasDiscoveryBackAction: false,
      }),
    ).toBe("close-settings");
  });

  it("returns to the default tab before exiting the app", () => {
    expect(
      resolveShellBackAction({
        activeDeviceId: "research",
        defaultDeviceId: "sculptor",
        settingsOpen: false,
        onboardingVisible: false,
        hasDiscoveryBackAction: false,
      }),
    ).toBe("go-default-tab");
  });
});
