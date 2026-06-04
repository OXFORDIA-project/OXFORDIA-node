import { describe, it, expect, vi } from "vitest";
import request from "supertest";
import { createApp } from "../createApp";
import type { PodServerConfig } from "../types";

// Mock the heavy OIDC token verifier used by validateWebId
vi.mock("@solid/access-token-verifier", () => ({
  createSolidTokenVerifier: () =>
    vi.fn().mockRejectedValue(new Error("No valid token")),
}));

vi.mock("@solid/community-server", () => ({
  parseForwarded: vi.fn().mockReturnValue(null),
  readableToQuads: vi.fn().mockResolvedValue([]),
}));

// ---------------------------------------------------------------------------
// Config fixture
// ---------------------------------------------------------------------------

function makeConfig(overrides: Partial<PodServerConfig> = {}): PodServerConfig {
  return {
    baseUrl: "http://localhost:3000/",
    rootFilePath: "/tmp/test-data",
    sparqlEndpoint: "",
    resourceStore: {
      getRepresentation: vi.fn().mockRejectedValue(new Error("Not found")),
    } as unknown as PodServerConfig["resourceStore"],
    statisticPlugins: [],
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Health check
// ---------------------------------------------------------------------------

describe("GET /healthz", () => {
  it("returns 200 when no sparqlEndpoint is configured", async () => {
    const app = createApp(makeConfig({ sparqlEndpoint: "" }));
    const res = await request(app).get("/healthz");
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ ok: true });
  });
});

// ---------------------------------------------------------------------------
// API routes — authentication guard
// ---------------------------------------------------------------------------

describe("POST /.api/stat/:route — unauthenticated", () => {
  it("returns 401 when no Authorization header is provided", async () => {
    const app = createApp(makeConfig());
    const res = await request(app)
      .post("/.api/stat/mean")
      .send({ resourceUri: "http://example.org/data" });
    expect(res.status).toBe(401);
  });

  it("returns 401 for an unrecognized route when unauthenticated", async () => {
    const app = createApp(makeConfig());
    const res = await request(app)
      .post("/.api/stat/does-not-exist")
      .send({});
    expect(res.status).toBe(401);
  });
});
