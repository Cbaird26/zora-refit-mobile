import { describe, expect, it } from "vitest";
import { buildJsonExportArtifact } from "./export";

describe("native export artifact builder", () => {
  it("creates a shareable JSON artifact shape", () => {
    const artifact = buildJsonExportArtifact("runs.json", "{\"ok\":true}");
    expect(artifact.fileName).toBe("runs.json");
    expect(artifact.mimeType).toBe("application/json");
    expect(artifact.contents).toContain("\"ok\":true");
  });
});
