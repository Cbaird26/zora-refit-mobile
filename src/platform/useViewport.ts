import { useEffect, useState } from "react";
import { getViewportWidth, isPhoneViewport } from "./runtime";

export function useViewport() {
  const [width, setWidth] = useState(getViewportWidth);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return {
    width,
    isMobile: isPhoneViewport(width),
  };
}
