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
})

test_that("mean query rejects string shortcut names", {
  target <- oxfordiar::ox_target("site_a", "https://pod.example.org/a.ttl")

  expect_error(
    ox_mean(shortcut = "BaselineAge", targets = list(target)),
    "ox_data_shortcut"
  )
})
