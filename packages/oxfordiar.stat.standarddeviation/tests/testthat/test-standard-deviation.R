test_that("standard deviation query parses the server response", {
  target <- oxfordiar::ox_target("site_a", "https://pod.example.org/a.ttl")
  shortcut <- oxfordiar::ox_data_shortcut(
    "BaselineAge",
    oxfordiar::ox_graph_path(
      start = oxfordiar::ox_node_filter(iri = "https://example.org/Person")
    )
  )

  testthat::local_mocked_bindings(
    ox_perform_request = function(target, route, body, auth = NULL) {
      expect_equal(route, "standard-deviation")
      expect_true("graphPath" %in% names(body))

      payload <- list(
        standardDeviation = 2.5,
        mean = 12.5,
        count = 8,
        distinctCount = 6
      )
      list(
        url = "https://pod.example.org/.api/stat/standard-deviation",
        status = 200L,
        auth_type = "none",
        headers = list(),
        body = payload,
        text = jsonlite::toJSON(payload, auto_unbox = TRUE)
      )
    },
    .package = "oxfordiar"
  )

  result <- ox_standard_deviation(shortcut = shortcut, targets = list(target))

  expect_equal(result$data$standard_deviation[[1]], 2.5)
  expect_equal(result$data$mean[[1]], 12.5)
  expect_equal(result$data$count[[1]], 8L)
  expect_equal(names(result$by_target), "site_a")
  expect_equal(result$by_target[[1]]$standard_deviation[[1]], 2.5)
  expect_equal(result$by_target[[1]]$distinct_count[[1]], 6L)
})

test_that("standard deviation query pools results across targets", {
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
  site_a_values <- c(1, 2, 3)
  site_b_values <- c(5, 7)

  testthat::local_mocked_bindings(
    ox_perform_request = function(target, route, body, auth = NULL) {
      values <- if (grepl("/a.ttl$", target$resource_uri)) {
        site_a_values
      } else {
        site_b_values
      }
      payload <- list(
        standardDeviation = stats::sd(values),
        mean = mean(values),
        count = length(values),
        distinctCount = length(unique(values))
      )

      list(
        url = "https://pod.example.org/.api/stat/standard-deviation",
        status = 200L,
        auth_type = "none",
        headers = list(),
        body = payload,
        text = jsonlite::toJSON(payload, auto_unbox = TRUE)
      )
    },
    .package = "oxfordiar"
  )

  result <- ox_standard_deviation(shortcut = shortcut, targets = targets)
  all_values <- c(site_a_values, site_b_values)

  expect_equal(result$data$standard_deviation[[1]], stats::sd(all_values))
  expect_equal(result$data$mean[[1]], mean(all_values))
  expect_equal(result$data$count[[1]], 5L)
  expect_equal(names(result$by_target), c("site_a", "site_b"))
  expect_equal(result$by_target[[1]]$standard_deviation[[1]], 1)
  expect_equal(result$by_target[[2]]$mean[[1]], 6)
})

test_that("standard deviation query rejects string shortcut names", {
  target <- oxfordiar::ox_target("site_a", "https://pod.example.org/a.ttl")

  expect_error(
    ox_standard_deviation(shortcut = "BaselineAge", targets = list(target)),
    "ox_data_shortcut"
  )
})
