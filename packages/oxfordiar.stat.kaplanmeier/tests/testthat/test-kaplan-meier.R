test_that("kaplan-meier query parses grouped observations", {
  target <- oxfordiar::ox_target("site_a", "https://pod.example.org/a.ttl")
  time <- oxfordiar::ox_data_shortcut(
    "KaplanMeierTime",
    oxfordiar::ox_graph_path(
      start = oxfordiar::ox_node_filter(iri = "https://example.org/Person")
    )
  )
  event <- oxfordiar::ox_data_shortcut(
    "KaplanMeierEvent",
    oxfordiar::ox_graph_path(
      start = oxfordiar::ox_node_filter(iri = "https://example.org/Person")
    )
  )
  group_by <- oxfordiar::ox_data_shortcut(
    "ClusterCategory",
    oxfordiar::ox_graph_path(
      start = oxfordiar::ox_node_filter(iri = "https://example.org/Person")
    )
  )

  testthat::local_mocked_bindings(
    ox_perform_request = function(target, route, body, auth = NULL) {
      expect_equal(route, "kaplan-meier")
      expect_true(all(
        c("timePath", "eventPath", "groupByPath") %in% names(body)
      ))

      list(
        url = "https://pod.example.org/.api/stat/kaplan-meier",
        status = 200L,
        auth_type = "none",
        headers = list(),
        body = list(
          groups = list(
            list(
              group = "https://example.org/Cluster_1",
              groupLabel = "Cluster_1",
              observations = list(
                list(time = 10, event = TRUE)
              )
            )
          )
        ),
        text = paste0(
          "{\"groups\":[{\"group\":\"https://example.org/Cluster_1\",",
          "\"groupLabel\":\"Cluster_1\",",
          "\"observations\":[{\"time\":10,\"event\":true}]}]}"
        )
      )
    },
    .package = "oxfordiar"
  )

  result <- ox_kaplan_meier(
    time = time,
    event = event,
    group_by = group_by,
    targets = list(target)
  )

  expect_equal(result$data$time[[1]], 10)
  expect_true(result$data$event[[1]])
  expect_equal(result$data$group[[1]], "Group 1")
  expect_equal(result$data$group_value[[1]], "https://example.org/Cluster_1")
})

test_that("kaplan-meier query rejects string shortcut names", {
  target <- oxfordiar::ox_target("site_a", "https://pod.example.org/a.ttl")
  event <- oxfordiar::ox_data_shortcut(
    "KaplanMeierEvent",
    oxfordiar::ox_graph_path(
      start = oxfordiar::ox_node_filter(iri = "https://example.org/Person")
    )
  )

  expect_error(
    ox_kaplan_meier(
      time = "KaplanMeierTime",
      event = event,
      targets = list(target)
    ),
    "ox_data_shortcut"
  )
})
