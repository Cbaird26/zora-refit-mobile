import { useEffect, useRef, useState } from "react";

export function useResponsiveCanvas(baseWidth: number, baseHeight: number, maxWidth = baseWidth) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState({
    width: baseWidth,
    height: baseHeight,
  });

  useEffect(() => {
    const element = containerRef.current;
    if (!element) {
      return;
    }

    const update = () => {
      const availableWidth = Math.min(element.clientWidth || baseWidth, maxWidth);
      const width = Math.max(240, Math.round(availableWidth));
      const height = Math.round((width / baseWidth) * baseHeight);
      setSize({ width, height });
    };

    update();

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", update);
      return () => window.removeEventListener("resize", update);
    }

    const observer = new ResizeObserver(() => update());
    observer.observe(element);
    return () => observer.disconnect();
  }, [baseHeight, baseWidth, maxWidth]);

  return {
    containerRef,
    canvasWidth: size.width,
    canvasHeight: size.height,
  };
}
