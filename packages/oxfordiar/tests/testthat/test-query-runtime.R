test_that("data shortcuts encode to graph paths in request bodies", {
  shortcut <- ox_data_shortcut(
    "BaselineAge",
    ox_graph_path(start = ox_node_filter(iri = "https://example.org/Person"))
  )
  target <- ox_target("site_a", "https://pod.example.org/data.ttl")

  body <- oxfordiar:::ox_build_request_body(target, list(graphPath = shortcut))

  expect_named(body, c("resourceUri", "graphPath"))
  expect_equal(body$resourceUri, "https://pod.example.org/data.ttl")
  expect_true(is.list(body$graphPath))
})

test_that("query errors when no targets are provided", {
  expect_error(
    ox_query(route = "mean", targets = list(), fields = list()),
    "At least one target"
  )
})

test_that("target auth overrides the default auth", {
  target <- ox_target(
    "site_a",
    "https://pod.example.org/a.ttl",
    auth = ox_auth_bearer("target-token")
  )

  auth <- oxfordiar:::ox_resolve_request_auth(
    ox_auth_bearer("client-token"),
    target
  )

  expect_equal(auth$type, "bearer")
  expect_equal(auth$token, "target-token")
})

test_that("target api_path and base_url drive the request URL", {
  target <- ox_target(
    "site_a",
    "https://pod.example.org/a.ttl",
    base_url = "https://api.example.org",
    api_path = "/custom/stat"
  )

  testthat::local_mocked_bindings(
    ox_post_json = function(url, body, auth = NULL) {
      stop(url, call. = FALSE)
    },
    .package = "oxfordiar"
  )

  expect_error(
    oxfordiar:::ox_perform_request(
      target = target,
      route = "mean",
      body = list(resourceUri = target$resource_uri)
    ),
    "https://api.example.org/custom/stat/mean"
  )
})

test_that("query aggregates target errors when fail_fast is false", {
  targets <- ox_targets(
    ox_target("site_a", "https://pod.example.org/a.ttl"),
    ox_target("site_b", "https://pod.example.org/b.ttl")
  )

  testthat::local_mocked_bindings(
    ox_query_one = function(
      route,
      target,
      fields,
      auth,
      parse_result,
      statistic
    ) {
      if (grepl("/a.ttl$", target$resource_uri)) {
        list(
          request = list(),
          response = list(),
          data = data.frame(value = 1, stringsAsFactors = FALSE)
        )
      } else {
        stop("broken target", call. = FALSE)
      }
    },
    .package = "oxfordiar"
  )

  result <- ox_query(route = "mean", targets = targets, fail_fast = FALSE)

  expect_equal(
    nrow(result$data),
    1
  )
  expect_equal(
    nrow(result$errors),
    1
  )
  expect_equal(result$errors$target[[1]], "site_b")
  expect_equal(result$errors$resource_uri[[1]], "https://pod.example.org/b.ttl")
})

test_that("query keeps provenance columns on parsed rows", {
  target <- ox_target("site_a", "https://pod.example.org/a.ttl")
  shortcut <- ox_data_shortcut(
    "BaselineAge",
    ox_graph_path(start = ox_node_filter(iri = "https://example.org/Person"))
  )

  testthat::local_mocked_bindings(
    ox_perform_request = function(target, route, body, auth = NULL) {
      list(
        url = "https://pod.example.org/.api/stat/mean",
        status = 200L,
        auth_type = "none",
        headers = list(),
        body = list(mean = 2, count = 1),
        text = "{\"mean\":2,\"count\":1}"
      )
    },
    .package = "oxfordiar"
  )

  result <- ox_query(
    route = "mean",
    targets = list(target),
    fields = list(graphPath = shortcut),
    parse_result = function(payload, target) {
      data.frame(
        mean = payload$mean,
        count = payload$count,
        stringsAsFactors = FALSE
      )
    }
  )

  expect_named(
    result$data,
    c("target", "resource_uri", "statistic", "mean", "count")
  )
  expect_equal(result$data$target[[1]], "site_a")
  expect_equal(result$data$statistic[[1]], "mean")
  expect_equal(names(result$by_target), "site_a")
  expect_equal(result$by_target[[1]]$target[[1]], "site_a")
})
