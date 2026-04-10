test_that("mean query parses the server response", {
  target <- oxfordiar::ox_target("site_a", "https://pod.example.org/a.ttl")
  shortcut <- oxfordiar::ox_data_shortcut(
    "BaselineAge",
    oxfordiar::ox_graph_path(
      start = oxfordiar::ox_node_filter(iri = "https://example.org/Person")
    )
  )

  testthat::local_mocked_bindings(
    ox_perform_request = function(target, route, body, auth = NULL) {
      expect_equal(route, "mean")
      expect_true("graphPath" %in% names(body))

      list(
        url = "https://pod.example.org/.api/stat/mean",
        status = 200L,
        auth_type = "none",
        headers = list(),
        body = list(mean = 12.5, count = 8),
        text = "{\"mean\":12.5,\"count\":8}"
      )
    },
    .package = "oxfordiar"
  )

  result <- ox_mean(shortcut = shortcut, targets = list(target))

  expect_equal(result$data$mean[[1]], 12.5)
  expect_equal(result$data$count[[1]], 8L)
  expect_equal(names(result$by_target), "site_a")
  expect_equal(result$by_target[[1]]$mean[[1]], 12.5)
  expect_equal(result$by_target[[1]]$count[[1]], 8L)
})

test_that("mean query returns an overall weighted mean and per-target rows", {
  targets <- oxfordiar::ox_targets(
    oxfordiar::ox_target("site_a", "https://pod.example.org/a.ttl"),
    oxfordiar::ox_target("site_b", "https://pod.example.org/b.ttl")
  )
  shortcut <- oxfordiar::ox_data_shortcut(
    "BaselineAge",
    oxfordiar::ox_graph_path(
      start = oxfordiar::ox_node_filter(iri = "https://example.org/Person")
    )
  )

  testthat::local_mocked_bindings(
    ox_perform_request = function(target, route, body, auth = NULL) {
      payload <- if (grepl("/a.ttl$", target$resource_uri)) {
        list(mean = 10, count = 2)
      } else {
        list(mean = 20, count = 3)
      }

      list(
        url = "https://pod.example.org/.api/stat/mean",
        status = 200L,
        auth_type = "none",
        headers = list(),
        body = payload,
        text = jsonlite::toJSON(payload, auto_unbox = TRUE)
      )
    },
    .package = "oxfordiar"
  )

  result <- ox_mean(shortcut = shortcut, targets = targets)

  expect_equal(result$data$mean[[1]], 16)
  expect_equal(result$data$count[[1]], 5L)
  expect_equal(names(result$by_target), c("site_a", "site_b"))
  expect_equal(result$by_target[[1]]$mean[[1]], 10)
  expect_equal(result$by_target[[2]]$mean[[1]], 20)
})

test_that("mean query rejects string shortcut names", {
  target <- oxfordiar::ox_target("site_a", "https://pod.example.org/a.ttl")

  expect_error(
    ox_mean(shortcut = "BaselineAge", targets = list(target)),
    "ox_data_shortcut"
  )
})
