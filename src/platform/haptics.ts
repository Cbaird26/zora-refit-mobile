import { Haptics, ImpactStyle, NotificationType } from "@capacitor/haptics";
import { isNativePlatform } from "./runtime";

export async function triggerImpact(style: ImpactStyle, enabled = true) {
  if (!enabled || !isNativePlatform()) {
    return;
  }

  try {
    await Haptics.impact({ style });
  } catch {
    // Ignore native haptics failures and keep the app interaction flowing.
  }
}

export async function triggerSelection(enabled = true) {
  if (!enabled || !isNativePlatform()) {
    return;
  }

  try {
    await Haptics.selectionStart();
    await Haptics.selectionChanged();
    await Haptics.selectionEnd();
  } catch {
    // Ignore native haptics failures and keep the app interaction flowing.
  }
}

export async function triggerArrival(enabled = true) {
  if (!enabled || !isNativePlatform()) {
    return;
  }

  try {
    await Haptics.notification({ type: NotificationType.Success });
  } catch {
    // Ignore native haptics failures and keep the app interaction flowing.
  }
}

export { ImpactStyle };
