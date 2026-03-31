import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import App, { DEFAULT_ACTIVE_DEVICE, TOP_LEVEL_DEVICES } from "./App.jsx";

describe("Zora Refit shell", () => {
  it("uses the required tab order with Probability Sculptor as default", () => {
    expect(DEFAULT_ACTIVE_DEVICE).toBe("sculptor");
    expect(TOP_LEVEL_DEVICES.map((device) => device.label)).toEqual([
      "Probability Sculptor",
      "Fold-Space Engine",
      "Timeline Selector",
      "Decision",
      "Intent",
      "Navigation",
      "Autopilot",
      "Research",
    ]);
  });

  it("renders the umbrella brand and default Probability Sculptor surface", () => {
    const html = renderToStaticMarkup(createElement(App));
    expect(html).toContain("Zora Refit");
    expect(html).toContain("Refit mobile surface · native shell anchored to the Phase V bridge artifact");
    expect(html).toContain("Probability Sculptor");
    expect(html).toContain("Fold-Space Engine");
    expect(html).toContain("Timeline Selector");
    expect(html).toContain("Decision");
    expect(html).toContain("Intent");
    expect(html).toContain("Navigation");
    expect(html).toContain("Autopilot");
    expect(html).toContain("Research");
    expect(html).toContain("Bias quantum branching toward desired futures");
  });
});
