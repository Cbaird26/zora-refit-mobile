import { App as NativeApp } from "@capacitor/app";
import { StatusBar, Style } from "@capacitor/status-bar";
import { isNativePlatform } from "./runtime";

export async function applySystemChrome() {
  if (!isNativePlatform()) {
    return;
  }

  try {
    await StatusBar.setStyle({ style: Style.Dark });
    await StatusBar.setBackgroundColor({ color: "#04050a" });
    await StatusBar.setOverlaysWebView({ overlay: false });
  } catch {
    // Ignore status bar failures and keep the app usable.
  }
}

export async function registerNativeBackHandler(handler: () => boolean | Promise<boolean>) {
  if (!isNativePlatform()) {
    return () => {};
  }

  const listener = await NativeApp.addListener("backButton", async () => {
    const handled = await handler();
    if (!handled) {
      await NativeApp.exitApp();
    }
  });

  return () => {
    void listener.remove();
  };
}
