import type { ShellBackAction, ShellBackContext } from "./types";

export function resolveShellBackAction(context: ShellBackContext): ShellBackAction {
  if (context.settingsOpen) {
    return "close-settings";
  }

  if (context.onboardingVisible) {
    return "dismiss-onboarding";
  }

  if (context.hasDiscoveryBackAction) {
    return "delegate-discovery";
  }

  if (context.activeDeviceId !== context.defaultDeviceId) {
    return "go-default-tab";
  }

  return "exit";
}
