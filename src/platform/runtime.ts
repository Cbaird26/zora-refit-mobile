import { Capacitor } from "@capacitor/core";

export const MOBILE_BREAKPOINT = 860;

export function isNativePlatform() {
  return Capacitor.isNativePlatform();
}

export function isPhoneViewport(width: number) {
  return width <= MOBILE_BREAKPOINT;
}

export function getViewportWidth() {
  if (typeof window === "undefined") {
    return 1280;
  }

  return window.innerWidth;
}

export function getPrefersReducedMotion() {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }

  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
