export type MobileSettings = {
  safeMode: boolean;
  reducedMotion: boolean;
  hapticsEnabled: boolean;
  brightnessEffectsEnabled: boolean;
  onboardingCompleted: boolean;
};

export type PersistedShellState = {
  activeDeviceId: string;
  settings: MobileSettings;
};

export type NativeExportArtifact = {
  fileName: string;
  mimeType: string;
  contents: string;
};

export type ShellBackContext = {
  activeDeviceId: string;
  defaultDeviceId: string;
  settingsOpen: boolean;
  onboardingVisible: boolean;
  hasDiscoveryBackAction: boolean;
};

export type ShellBackAction =
  | "close-settings"
  | "dismiss-onboarding"
  | "delegate-discovery"
  | "go-default-tab"
  | "exit";
