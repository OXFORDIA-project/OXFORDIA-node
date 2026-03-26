# Server API (Custom Endpoints)

This document describes the custom HTTP endpoints implemented in this repository.
Most Solid/Community Server endpoints are not covered here.

## Statistics endpoint

### Route

`POST /.api/stat/{route}`

The `{route}` path segment is resolved dynamically against the registered statistics
plugins in `server/src/api/statistic/statisticQueryHandler.ts`.

Currently supported values:

* `mean`
* `kaplan-meier`

### Authentication

All requests to `/.api/*` must pass the middleware in `server/src/api/validateWebId.ts`:

* `Authorization: Bearer <access-token>`
* `DPoP: <dpop-proof>`

Additionally, the access token WebID must equal:

* `{baseUrl}admin/profile/card#me`

On authentication failures the server returns `401` or `403` with a plain-text error body.

### Policy authorization (how the server decides “allowed”)

The request body contains a `resourceUri`. The server loads an RDF access-rule document
derived from that URI:

* If `resourceUri` ends with `.statistic-access-rule.ttl`, use it as-is.
* Else if `resourceUri` ends with `.ttl`, replace `.ttl` with `.statistic-access-rule.ttl`.
* Else append `.statistic-access-rule.ttl`.

Then it expects the document to contain a typed root node:

* `rdf:type sar:StatisticAccessRule`

The server also relies on the access-rule document being compatible with the
`StatisticAccessRuleDocumentShapeType` (see `plugins/_shex/oxfordia.shex`), which means the
document should include at least:

* `sar:dataSchema` (xsd:string)
* `sar:hasStatisticPolicy` (one-or-more policy entries)

The server matches policy entries by:

* For each `sar:hasStatisticPolicy` entry, it checks `sar:statisticName`
  against the plugin `name` (and `route`).

If no matching policy exists (or if the query/policy checks fail), the server returns `403`.

### Error handling (statistics endpoint)

This Express API uses a shared error middleware (`server/src/api/apiRouter.ts`) that converts
exceptions into a status code + message and returns the message as the response body.

For `POST /.api/stat/{route}`, responses are:

| Status | Meaning | Body format |
|---|---|---|
| `404` | Unknown `{route}` (no plugin registered) | JSON: `{ "error": "Unknown statistic: ..." }` |
| `400` | Request JSON does not match the plugin `querySchema` (validation) | Plain text (example: `Invalid query for statistic 'mean': ...`) |
| `401` | Access token verification failed | Plain text (example: `Error verifying Access Token via WebID: ...`) |
| `403` | WebID mismatch and/or policy denied the query/result | Plain text (examples: `Not authorized.`, `No statistic policy in '...' matches 'mean'.`) |
| `500` | Unexpected server/runtime error | Plain text |

### Common request/response pattern

The request is JSON and is validated against each plugin’s `querySchema`:

* Invalid bodies yield `400` (plain text).
* On success, the response is JSON containing the plugin output object.

## `mean`

### Request payload

`POST /.api/stat/mean`

Body shape:

```json
{
  "resourceUri": "string",
  "graphPath": { "...": "GraphPath JSON object" }
}
```

`graphPath` must follow the GraphPath structure from `plugins/graphPath.ts`.

#### Example request (copy/paste)

This `graphPath` is the Nemaline `BaselineAge` shortcut from `plugins/dataPlugin/nemaline/shortcuts.ts`.

```json
{
  "resourceUri": "http://localhost:3000/admin/FakeData2.ttl",
  "graphPath": {
    "start": {
      "predicates": [
        {
          "predicate": { "@id": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type" },
          "some": {
            "node": { "iri": "https://w3id.org/semanticarts/ns/ontology/gist/Person" }
          }
        }
      ]
    },
    "steps": [
      {
        "via": { "@id": "https://w3id.org/semanticarts/ns/ontology/gist/hasMagnitude" },
        "where": {
          "predicates": [
            {
              "predicate": { "@id": "https://w3id.org/semanticarts/ns/ontology/gist/hasAspect" },
              "some": {
                "node": { "iri": "https://w3id.org/semanticarts/ns/ontology/gist/Aspect_Age" }
              }
            }
          ]
        }
      },
      { "via": { "@id": "https://w3id.org/semanticarts/ns/ontology/gist/numericValue" } }
    ]
  }
}
```

#### Example curl

```bash
curl -sS -X POST "http://localhost:8889/.api/stat/mean" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -H "DPoP: <DPOP_PROOF>" \
  -d @mean-request.json
```

### Response payload

`200 OK` returns:

```json
{
  "mean": 42.7,
  "count": 12
}
```

### Mean policy enforcement (what can block the request)

The server checks the `graphPath` against the `mean` access rule before and after computation:

Mean policies are expressed under `statp:allowedPath` entries, where each allowed path
contains:

* `statp:graphPath` (the allowed GraphPath)
* `statp:minCount` (minimum count required to return a result)

Checks:

* Pre-query: the requested `graphPath` must match at least one allowed `statp:graphPath`
* Post-query: the returned `count` must be `>= statp:minCount` for the matched allowed path

If no numeric values are found for the provided `graphPath`, the mean plugin throws
and you may see `500` with a plain-text message like:
`No numeric values found for the provided graphPath.`

## `kaplan-meier`

### Request payload

`POST /.api/stat/kaplan-meier`

Body shape:

```json
{
  "resourceUri": "string",
  "timePath": { "...": "GraphPath JSON object" },
  "eventPath": { "...": "GraphPath JSON object" },
  "groupByPath": { "...": "GraphPath JSON object" } // optional
}
```

#### Example request (copy/paste)

This uses Nemaline shortcuts:

* `timePath`: `KaplanMeierTime`
* `eventPath`: `KaplanMeierEvent`

(`groupByPath` omitted.)

```json
{
  "resourceUri": "http://localhost:3000/admin/FakeData2.ttl",
  "timePath": {
    "start": {
      "predicates": [
        {
          "predicate": { "@id": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type" },
          "some": {
            "node": { "iri": "https://w3id.org/semanticarts/ns/ontology/gist/Person" }
          }
        }
      ]
    },
    "steps": [
      {
        "via": { "@id": "https://w3id.org/semanticarts/ns/ontology/gist/hasParticipant" },
        "inverse": true,
        "where": {
          "predicates": [
            {
              "predicate": { "@id": "https://w3id.org/semanticarts/ns/ontology/gist/isCategorizedBy" },
              "some": {
                "node": { "iri": "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/AssessmentType_KaplanMeier" }
              }
            }
          ]
        }
      },
      {
        "via": { "@id": "https://w3id.org/semanticarts/ns/ontology/gist/hasMagnitude" },
        "where": {
          "predicates": [
            {
              "predicate": { "@id": "https://w3id.org/semanticarts/ns/ontology/gist/hasAspect" },
              "some": {
                "node": { "iri": "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Aspect_KaplanMeierTimeToEvent" }
              }
            }
          ]
        }
      },
      { "via": { "@id": "https://w3id.org/semanticarts/ns/ontology/gist/numericValue" } }
    ]
  },
  "eventPath": {
    "start": {
      "predicates": [
        {
          "predicate": { "@id": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type" },
          "some": {
            "node": { "iri": "https://w3id.org/semanticarts/ns/ontology/gist/Person" }
          }
        }
      ]
    },
    "steps": [
      {
        "via": { "@id": "https://w3id.org/semanticarts/ns/ontology/gist/hasParticipant" },
        "inverse": true,
        "where": {
          "predicates": [
            {
              "predicate": { "@id": "https://w3id.org/semanticarts/ns/ontology/gist/isCategorizedBy" },
              "some": {
                "node": { "iri": "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/AssessmentType_KaplanMeier" }
              }
            }
          ]
        }
      },
      {
        "via": { "@id": "https://w3id.org/semanticarts/ns/ontology/gist/hasMagnitude" },
        "where": {
          "predicates": [
            {
              "predicate": { "@id": "https://w3id.org/semanticarts/ns/ontology/gist/hasAspect" },
              "some": {
                "node": { "iri": "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Aspect_KaplanMeierEventIndicator" }
              }
            }
          ]
        }
      },
      { "via": { "@id": "https://w3id.org/semanticarts/ns/ontology/gist/numericValue" } }
    ]
  }
}
```

### Response payload

`200 OK` returns:

```json
{
  "observations": [
    {
      "time": 0.5,
      "event": true
      // "group": "..." // optional
    }
  ]
}
```

Notes:

* `event` is a boolean derived from the numeric event binding (`eventNumeric !== 0`)
* `group` is only included if you provide `groupByPath` and the returned row includes a group binding

### Kaplan–Meier policy enforcement (what can block the request)

The server enforces access rules by matching *signatures* of the requested paths against the
allowed paths inside the access rule document:

Kaplan–Meier policies are expressed under `statp:allowedPath` entries, where each allowed path
contains:

* `statp:timeGraphPath`
* `statp:eventGraphPath`
* optional `statp:groupByGraphPath`
* `statp:k-anonymity`

Checks:

* Pre-query: requested `timePath` + `eventPath` signatures must match an allowed entry's
  `statp:timeGraphPath` + `statp:eventGraphPath`
* Pre-query (optional): if you provide `groupByPath`, it must also match an allowed entry's
  `statp:groupByGraphPath`
* Post-query: currently always allows (no additional checks after computation)

The policy shape includes `k-anonymity` (`statp:k-anonymity` in `plugins/_shex/oxfordia.shex`),
but the current Kaplan–Meier evaluator does not enforce it, so you may still see results
even if `k-anonymity` is set to a higher value.
