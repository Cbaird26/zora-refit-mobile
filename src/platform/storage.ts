import { Preferences } from "@capacitor/preferences";
import { isNativePlatform } from "./runtime";

async function readNativeKey(key: string) {
  const result = await Preferences.get({ key });
  return result.value;
}

async function writeNativeKey(key: string, value: string) {
  await Preferences.set({ key, value });
}

export async function loadStoredString(key: string) {
  if (isNativePlatform()) {
    return readNativeKey(key);
  }

  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(key);
}

export async function saveStoredString(key: string, value: string) {
  if (isNativePlatform()) {
    await writeNativeKey(key, value);
    return;
  }

  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(key, value);
}
