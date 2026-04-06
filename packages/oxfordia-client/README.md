# `oxfordia-client`

`oxfordia-client` is an R package for issuing Oxfordia statistic queries across one or more servers from a single client object.

Server authentication is handled through the companion [`solidauthr`](../solidauthr/README.md) package. The default model is one authenticated client plus many targets.

## How It Works

The package mirrors the plugin split already present in the TypeScript codebase:

- Data plugins publish named graph-path shortcuts such as `BaselineAge`, `KaplanMeierTime`, and `ClusterCategory`.
- Statistic plugins publish the request shape for a statistic route such as `mean` or `kaplan-meier`.
- A client instance holds registries for servers, data plugins, and statistic plugins.
- A query spec is resource-agnostic. It describes the statistic you want and the graph-path fields it needs.
- A target binds that reusable spec to one concrete server and one concrete `resourceUri`.

When you call `ox_query()`, the client fans the query spec out across all supplied targets. For each target it:

1. Looks up the target server configuration.
2. Resolves any shortcut references against the target data schema.
3. Builds the request body expected by the Oxfordia statistic API.
4. Sends a POST request to `/.api/stat/<route>` on the resource origin by default, or on `base_url` if the server config overrides it.
5. Parses the response using the registered statistic plugin.
6. Returns one combined data frame with provenance columns for `server`, `resource_uri`, `data_schema`, and `statistic`.

That fan-out step is the multi-server aggregation mechanism. `ox_query()` already accepts multiple targets, queries each target server independently, and merges the parsed rows into one result set.

## Solid Authentication

Use `ox_auth_solid()` to attach Solid client-credentials authentication to the client:

```r
client <- default_client(
  auth = ox_auth_solid(
    issuer = "https://solid-idp.example.org",
    client_id = Sys.getenv("SOLID_CLIENT_ID"),
    client_secret = Sys.getenv("SOLID_CLIENT_SECRET")
  )
)
```

If you omit `base_url`, the client derives it from each target `resource_uri`. Keep `base_url` only when the Oxfordia API is hosted on a different origin than the resource itself.

If you want to build the session yourself, `ox_client()` and `ox_server()` both accept a prebuilt `solidauthr::solid_session()` object in `auth`.

Per-server auth still works as an override, but the intended default is one global auth configuration on the client.

## Default Client

The package exports `default_client(auth = ox_auth_none())`. It returns a fresh client with the built-in plugin catalogs already registered:

- data plugin: `nemaline`
- statistic plugins: `mean`, `kaplan-meier`

It does not register any servers. You add your own endpoints on top:

```r
client <- default_client(
  auth = ox_auth_solid(
    issuer = "https://solid-idp.example.org",
    client_id = Sys.getenv("SOLID_CLIENT_ID"),
    client_secret = Sys.getenv("SOLID_CLIENT_SECRET")
  )
) |>
  ox_register_server(
    ox_server(
      name = "site_a"
    )
  ) |>
  ox_register_server(
    ox_server(
      name = "site_b"
    )
  )
```

## Basic Mean Query

```r
client <- default_client(
  auth = ox_auth_solid(
    issuer = "https://solid-idp.example.org",
    client_id = Sys.getenv("SOLID_CLIENT_ID"),
    client_secret = Sys.getenv("SOLID_CLIENT_SECRET")
  )
) |>
  ox_register_server(
    ox_server(
      "site_a"
    )
  ) |>
  ox_register_server(
    ox_server(
      "site_b"
    )
  )

targets <- ox_targets(
  ox_target("site_a", "https://pod-a.example.org/alice/data.ttl"),
  ox_target("site_b", "https://pod-b.example.org/bob/data.ttl")
)

spec <- ox_mean(
  graph_path = ox_shortcut("BaselineAge"),
  data_schema = "nemaline"
)

result <- ox_query(client, spec, targets = targets, fail_fast = FALSE)
print(result$data)
print(result$errors)
```

## Kaplan-Meier Query

```r
km_spec <- ox_kaplan_meier(
  time_path = ox_shortcut("KaplanMeierTime"),
  event_path = ox_shortcut("KaplanMeierEvent"),
  group_by_path = ox_shortcut("ClusterCategory"),
  data_schema = "nemaline"
)

km_result <- ox_query(client, km_spec, targets = targets, fail_fast = FALSE)
print(km_result$data)
```

When `group_by_path` is present, Kaplan-Meier rows include a display-friendly `group` column and a raw `group_value` column. For the built-in nemaline cluster grouping, `group` is rendered as `Group 1`, `Group 2`, and `Group 3`.

## Custom Plugins

You can register your own data or statistic plugins rather than relying on the built-ins.

```r
my_data_plugin <- ox_data_plugin(
  name = "my-schema",
  shortcuts = list(
    MyValue = function() {
      ox_graph_path(
        start = ox_node_filter(rdf_type = "https://example.org/Person"),
        steps = list(
          ox_traversal_step("https://example.org/hasValue")
        )
      )
    }
  )
)

my_stat_plugin <- ox_stat_plugin(
  name = "my-stat",
  route = "my-stat",
  fields = list(
    ox_query_field(
      name = "graph_path",
      json_key = "graphPath",
      kind = "graph_path",
      required = TRUE,
      shortcutable = TRUE
    )
  ),
  parse_result = function(payload, target, spec) {
    data.frame(value = payload$value, stringsAsFactors = FALSE)
  }
)

client <- ox_client() |>
  ox_register_data_plugin(my_data_plugin) |>
  ox_register_stat_plugin(my_stat_plugin)
```

## Smoke Test Script

A simple runnable script lives at [`scripts/smoke-test.R`](./scripts/smoke-test.R). It sources `oxfordia-client` locally from the repo, but still expects runtime dependencies such as `solidauthr` to be installed.

Install the smoke-test dependencies first:

```bash
Rscript packages/oxfordia-client/scripts/install-deps.R
```

That installs the required CRAN packages plus the local `solidauthr` package into your active R library. The smoke test itself only checks that those packages are already available.

Set `OX_DEBUG=1` before running the smoke test if you want live request and response logs in addition to the final error summary.

The script now supports `.env` files. It loads the first file it finds in this order:

1. `OX_ENV_FILE` if you set it explicitly
2. `packages/oxfordia-client/.env` if present
3. `./.env` in the current working directory if present

Values already present in the shell take precedence over the `.env` file.

The smoke test uses one global auth block, one global query spec, and one or more indexed targets. Target entries only contain `SERVER_NAME` and `RESOURCE_URI`. Optional server URL overrides use separate `OX_SERVER_<n>_*` entries keyed by server name.

Start from the tracked [`.env.example`](./.env.example) file:

```bash
cp packages/oxfordia-client/.env.example packages/oxfordia-client/.env
Rscript packages/oxfordia-client/scripts/smoke-test.R
```

Multi-target `.env` example:

```dotenv
OX_STAT=mean
OX_DATA_SCHEMA=nemaline
OX_SHORTCUT=BaselineAge

OX_SOLID_ISSUER=https://solid-idp.example.org
OX_SOLID_CLIENT_ID=shared-client-id
OX_SOLID_CLIENT_SECRET=shared-client-secret

OX_TARGET_1_SERVER_NAME=site_a
OX_TARGET_1_RESOURCE_URI=https://pod-a.example.org/alice/data.ttl

OX_TARGET_2_SERVER_NAME=site_b
OX_TARGET_2_RESOURCE_URI=https://pod-b.example.org/bob/data.ttl

# Optional server override entries when an API origin differs from the resource origin
# OX_SERVER_1_NAME=site_a
# OX_SERVER_1_URL=https://api-a.example.org
# OX_SERVER_2_NAME=site_b
# OX_SERVER_2_URL=https://api-b.example.org
```

The smoke test always uses indexed targets. Even a one-target run should use `OX_TARGET_1_*`. Results are aggregated across all configured targets in one `ox_query()` call.
