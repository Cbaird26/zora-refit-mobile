import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import DiscoveryHost from "./DiscoveryHost";

describe("DiscoveryHost", () => {
  it("renders the shared ZoraASI Bridge wrapper for every imported mode", () => {
    const decision = renderToStaticMarkup(<DiscoveryHost mode="DECISION" />);
    const intent = renderToStaticMarkup(<DiscoveryHost mode="INTENT" />);
    const navigation = renderToStaticMarkup(<DiscoveryHost mode="NAVIGATION" />);
    const autopilot = renderToStaticMarkup(<DiscoveryHost mode="AUTOPILOT" />);
    const research = renderToStaticMarkup(<DiscoveryHost mode="RESEARCH" />);

    expect(decision).toContain("ZoraASI Bridge");
    expect(decision).toContain("Zora Refit");
    expect(decision).toContain("Coherence Engine Warp Core");
    expect(decision).toContain("Option A");

    expect(intent).toContain("Target Outcome");
    expect(intent).toContain("Future Viability");

    expect(navigation).toContain("Target X");
    expect(navigation).toContain("Target Y");
    expect(navigation).toContain("Target Z");

    expect(autopilot).toContain("Navigator Inputs");
    expect(autopilot).toContain("Autopicked");
    expect(autopilot).toContain("Use This Route");

    expect(research).toContain("Quick Sweep");
    expect(research).toContain("No recorded runs yet.");
    expect(research).toContain("Experimental Visibility");
  });
});
