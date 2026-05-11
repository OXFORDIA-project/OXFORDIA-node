import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import type { Request, Response, NextFunction } from "express";
import { createStatisticQueryHandler } from "../api/statistic/statisticQueryHandler";
import type { PodServerGlobals } from "../types";
import type { AnyStatisticApiPlugin } from "@oxfordia/stat-plugin_server";
import type { JSONSchema4 } from "json-schema";

// ---------------------------------------------------------------------------
// vi.mock — isolate heavy CSS/LDO dependencies
// ---------------------------------------------------------------------------

vi.mock("@solid/community-server", () => ({
  readableToQuads: vi.fn().mockResolvedValue([]),
}));

vi.mock("@ldo/ldo", () => ({
  createLdoDataset: vi.fn(),
  getRdfNode: vi.fn().mockReturnValue({}),
}));

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const noopLogger = {
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
  debug: vi.fn(),
};

const meanQuerySchema: JSONSchema4 = {
  type: "object",
  additionalProperties: false,
  required: ["resourceUri", "graphPath"],
  properties: {
    resourceUri: { type: "string", format: "uri", minLength: 1 },
    graphPath: {
      type: "object",
      required: ["start"],
      properties: { start: { type: "object" } },
    },
  },
};

function makeMockPlugin(
  route: string,
  overrides: Partial<AnyStatisticApiPlugin<PodServerGlobals>> = {},
): AnyStatisticApiPlugin<PodServerGlobals> {
  return {
    name: route,
    route,
    querySchema: meanQuerySchema,
    statisticAccessRuleSchema: {} as AnyStatisticApiPlugin<PodServerGlobals>["statisticAccessRuleSchema"],
    statisticAccessRuleShapeType: {} as AnyStatisticApiPlugin<PodServerGlobals>["statisticAccessRuleShapeType"],
    normalizeQuery: undefined,
    evaluateStatisticAccessRulePreQuery: vi.fn().mockReturnValue(true),
    evaluateStatisticAccessRulePostQuery: vi.fn().mockReturnValue(true),
    performQuery: vi.fn().mockResolvedValue({ mean: 5.0, count: 10 }),
    ...overrides,
  } as unknown as AnyStatisticApiPlugin<PodServerGlobals>;
}

function makeMockGlobals(
  plugins: AnyStatisticApiPlugin<PodServerGlobals>[] = [],
  resourceStoreOverrides: Partial<PodServerGlobals["resourceStore"]> = {},
): PodServerGlobals {
  return {
    baseUrl: "http://localhost:3000",
    rootFilePath: "/data",
    sparqlEndpoint: "http://localhost:8889/sparql",
    sparqlFetcher: { fetchBindings: vi.fn() } as unknown as PodServerGlobals["sparqlFetcher"],
    dataPlugins: [],
    statisticPlugins: plugins,
    logger: noopLogger as unknown as PodServerGlobals["logger"],
    resourceStore: {
      getRepresentation: vi.fn().mockRejectedValue(
        Object.assign(new Error("Not found"), { statusCode: 404 }),
      ),
      ...resourceStoreOverrides,
    } as unknown as PodServerGlobals["resourceStore"],
  };
}

function makeRequest(
  route: string,
  body: unknown = {},
): Pick<Request, "params" | "body"> {
  return {
    params: { route },
    body,
  };
}

function makeResponse(authenticatedAgent?: string): {
  status: Mock;
  json: Mock;
  locals: Record<string, unknown>;
} {
  const json = vi.fn();
  const status = vi.fn().mockReturnValue({ json });
  return {
    status,
    json,
    locals: authenticatedAgent ? { authenticatedAgent } : {},
  };
}

// ---------------------------------------------------------------------------
// Tests: 404 — unknown statistic route
// ---------------------------------------------------------------------------

describe("createStatisticQueryHandler — unknown route", () => {
  it("calls res.status(404) when no plugin matches the route", async () => {
    const globals = makeMockGlobals([]);
    const handler = createStatisticQueryHandler(globals);
    const req = makeRequest("unknown-stat");
    const res = makeResponse("https://agent.example/profile#me");
    const next = vi.fn();

    await handler(req as Request, res as unknown as Response, next as NextFunction);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: expect.stringContaining("unknown-stat") }),
    );
  });
});

// ---------------------------------------------------------------------------
// Tests: 400 — invalid query body
// ---------------------------------------------------------------------------

describe("createStatisticQueryHandler — invalid query", () => {
  it("throws an error with status 400 for a missing required field", async () => {
    const plugin = makeMockPlugin("mean");
    const globals = makeMockGlobals([plugin]);
    const handler = createStatisticQueryHandler(globals);

    const req = makeRequest("mean", { resourceUri: "http://example.org/data" });
    const res = makeResponse("https://agent.example/profile#me");

    await expect(
      handler(req as Request, res as unknown as Response, vi.fn() as NextFunction),
    ).rejects.toMatchObject({ status: 400 });
  });

  it("throws 400 for a body with an unknown top-level property", async () => {
    const plugin = makeMockPlugin("mean");
    const globals = makeMockGlobals([plugin]);
    const handler = createStatisticQueryHandler(globals);

    const req = makeRequest("mean", {
      resourceUri: "http://example.org/data.ttl",
      graphPath: { start: {} },
      unknownField: true, // rejected by additionalProperties: false
    });
    const res = makeResponse("https://agent.example/profile#me");

    await expect(
      handler(req as Request, res as unknown as Response, vi.fn() as NextFunction),
    ).rejects.toMatchObject({ status: 400 });
  });

  it("throws 400 for an empty body", async () => {
    const plugin = makeMockPlugin("mean");
    const globals = makeMockGlobals([plugin]);
    const handler = createStatisticQueryHandler(globals);

    const req = makeRequest("mean", {});
    const res = makeResponse("https://agent.example/profile#me");

    await expect(
      handler(req as Request, res as unknown as Response, vi.fn() as NextFunction),
    ).rejects.toMatchObject({ status: 400 });
  });
});

// ---------------------------------------------------------------------------
// Tests: 403 — access rule document not found
// ---------------------------------------------------------------------------

describe("createStatisticQueryHandler — access rule not found", () => {
  it("propagates a rejection from the resource store (403 pathway)", async () => {
    const plugin = makeMockPlugin("mean");
    const globals = makeMockGlobals([plugin]);
    const handler = createStatisticQueryHandler(globals);

    const req = makeRequest("mean", {
      resourceUri: "http://example.org/data.ttl",
      graphPath: { start: {} },
    });
    const res = makeResponse("https://agent.example/profile#me");

    await expect(
      handler(req as Request, res as unknown as Response, vi.fn() as NextFunction),
    ).rejects.toThrow();
  });

  it("logs the error via the global logger before rethrowing", async () => {
    const plugin = makeMockPlugin("mean");
    const globals = makeMockGlobals([plugin]);
    const handler = createStatisticQueryHandler(globals);

    const req = makeRequest("mean", {
      resourceUri: "http://example.org/data.ttl",
      graphPath: { start: {} },
    });
    const res = makeResponse("https://agent.example/profile#me");

    try {
      await handler(
        req as Request,
        res as unknown as Response,
        vi.fn() as NextFunction,
      );
    } catch {
      // expected
    }

    expect(noopLogger.error).toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// Tests: 401 — missing authenticated agent (access rule found but no agent)
// ---------------------------------------------------------------------------

describe("createStatisticQueryHandler — authenticated agent check", () => {
  it("throws 401 when the access rule is found but no authenticated agent is set", async () => {
    const { createLdoDataset } = await import("@ldo/ldo");
    const mockedCreateLdoDataset = createLdoDataset as Mock;

    const fakeAccessRule = {
      "@id": "http://example.org/data.ttl.statistic-access-rule.ttl#policy",
      allowedAgents: [{ "@id": "https://agent.example/profile#me" }],
      hasStatisticPolicy: [],
    };
    const fakeDataset = {
      usingType: vi.fn().mockReturnValue({
        matchSubject: vi.fn().mockReturnValue([fakeAccessRule]),
        fromSubject: vi.fn().mockReturnValue(fakeAccessRule),
      }),
    };
    mockedCreateLdoDataset.mockReturnValue(fakeDataset);

    const { readableToQuads } = await import("@solid/community-server");
    (readableToQuads as Mock).mockResolvedValue([]);

    const plugin = makeMockPlugin("mean");
    const mockRepresentation = {
      data: { [Symbol.asyncIterator]: vi.fn() },
      metadata: {},
    };
    const globals = makeMockGlobals([plugin], {
      getRepresentation: vi.fn().mockResolvedValue(mockRepresentation),
    });

    const handler = createStatisticQueryHandler(globals);

    const req = makeRequest("mean", {
      resourceUri: "http://example.org/data.ttl",
      graphPath: { start: {} },
    });
    // No authenticated agent in locals
    const res = makeResponse();

    await expect(
      handler(req as Request, res as unknown as Response, vi.fn() as NextFunction),
    ).rejects.toMatchObject({ status: 401 });
  });
});
