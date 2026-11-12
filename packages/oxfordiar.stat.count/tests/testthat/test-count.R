test_that("count query parses the server response", {
  target <- oxfordiar::ox_target("site_a", "https://pod.example.org/a.ttl")
  shortcut <- oxfordiar::ox_data_shortcut(
    "Patients",
    oxfordiar::ox_graph_path(
      start = oxfordiar::ox_node_filter(iri = "https://example.org/Person")
    )
  )

  testthat::local_mocked_bindings(
    ox_perform_request = function(target, route, body, auth = NULL) {
      expect_equal(route, "count")
      expect_true("graphPath" %in% names(body))

      list(
        url = "https://pod.example.org/.api/stat/count",
        status = 200L,
        auth_type = "none",
        headers = list(),
        body = list(count = 8),
        text = "{\"count\":8}"
      )
    },
    .package = "oxfordiar"
  )

  result <- ox_count(shortcut = shortcut, targets = list(target))

  expect_equal(result$data$count[[1]], 8L)
  expect_equal(names(result$by_target), "site_a")
  expect_equal(result$by_target[[1]]$count[[1]], 8L)
})

test_that("count query sums counts across targets", {
  targets <- oxfordiar::ox_targets(
    oxfordiar::ox_target("site_a", "https://pod.example.org/a.ttl"),
    oxfordiar::ox_target("site_b", "https://pod.example.org/b.ttl")
  )
  shortcut <- oxfordiar::ox_data_shortcut(
    "Patients",
    oxfordiar::ox_graph_path(
      start = oxfordiar::ox_node_filter(iri = "https://example.org/Person")
    )
  )

  testthat::local_mocked_bindings(
    ox_perform_request = function(target, route, body, auth = NULL) {
      payload <- if (grepl("/a.ttl$", target$resource_uri)) {
        list(count = 12)
      } else {
        list(count = 30)
      }

      list(
        url = "https://pod.example.org/.api/stat/count",
        status = 200L,
        auth_type = "none",
        headers = list(),
        body = payload,
        text = jsonlite::toJSON(payload, auto_unbox = TRUE)
      )
    },
    .package = "oxfordiar"
  )

  result <- ox_count(shortcut = shortcut, targets = targets)

  expect_equal(result$data$count[[1]], 42L)
  expect_equal(names(result$by_target), c("site_a", "site_b"))
  expect_equal(result$by_target[[1]]$count[[1]], 12L)
  expect_equal(result$by_target[[2]]$count[[1]], 30L)
})

test_that("count query rejects string shortcut names", {
  target <- oxfordiar::ox_target("site_a", "https://pod.example.org/a.ttl")

  expect_error(
    ox_count(shortcut = "Patients", targets = list(target)),
    "ox_data_shortcut"
  )
})
