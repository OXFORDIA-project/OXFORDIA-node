# `oxfordia-client`

`oxfordia-client` is an R package for issuing Oxfordia statistic queries across one or more servers from a single client object.

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
4. Sends a POST request to `/.api/stat/<route>`.
5. Parses the response using the registered statistic plugin.
6. Returns one combined data frame with provenance columns for `server`, `resource_uri`, `data_schema`, and `statistic`.

## Default Client

The package exports `default_client()`. It returns a fresh client with the built-in plugin catalogs already registered:

- data plugin: `nemaline`
- statistic plugins: `mean`, `kaplan-meier`

It does not register any servers. You add your own endpoints on top:

```r
client <- default_client() |>
  ox_register_server(
    ox_server(
      name = "site_a",
      base_url = "https://pod-a.example.org",
      auth = ox_auth_bearer(Sys.getenv("SITE_A_TOKEN"))
    )
  ) |>
  ox_register_server(
    ox_server(
      name = "site_b",
      base_url = "https://pod-b.example.org"
    )
  )
```

## Basic Mean Query

```r
client <- default_client() |>
  ox_register_server(
    ox_server("site_a", "https://pod-a.example.org")
  ) |>
  ox_register_server(
    ox_server("site_b", "https://pod-b.example.org")
  )

targets <- ox_targets(
  ox_target("site_a", "https://pod-a.example.org/alice/data.ttl", data_schema = "nemaline"),
  ox_target("site_b", "https://pod-b.example.org/bob/data.ttl", data_schema = "nemaline")
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

A simple runnable script lives at [`scripts/smoke-test.R`](./scripts/smoke-test.R). It sources the package locally from the repo, so you can run it without first installing the package.

Mean example:

```bash
OX_SERVER_NAME=site_a \
OX_SERVER_URL=https://pod.example.org \
OX_RESOURCE_URI=https://pod.example.org/alice/data.ttl \
OX_DATA_SCHEMA=nemaline \
OX_STAT=mean \
OX_SHORTCUT=BaselineAge \
Rscript packages/oxfordia-client/scripts/smoke-test.R
```

Bearer token example:

```bash
OX_SERVER_NAME=site_a \
OX_SERVER_URL=https://pod.example.org \
OX_RESOURCE_URI=https://pod.example.org/alice/data.ttl \
OX_BEARER_TOKEN=your-token-here \
OX_DATA_SCHEMA=nemaline \
OX_STAT=mean \
OX_SHORTCUT=BaselineAge \
Rscript packages/oxfordia-client/scripts/smoke-test.R
```

Kaplan-Meier example:

```bash
OX_SERVER_NAME=site_a \
OX_SERVER_URL=https://pod.example.org \
OX_RESOURCE_URI=https://pod.example.org/alice/data.ttl \
OX_DATA_SCHEMA=nemaline \
OX_STAT=kaplan-meier \
OX_TIME_SHORTCUT=KaplanMeierTime \
OX_EVENT_SHORTCUT=KaplanMeierEvent \
OX_GROUP_SHORTCUT=ClusterCategory \
Rscript packages/oxfordia-client/scripts/smoke-test.R
```

