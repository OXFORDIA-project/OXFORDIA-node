gene_path <- function() {
  ox_graph_path(
    start = ox_node_filter(iri = "https://example.org/Person"),
    name = "CausativeGene"
  )
}

test_that("ox_group_by_spec accepts NULL, one shortcut, or a list of two", {
  expect_null(ox_group_by_spec(NULL)$paths)

  gene <- ox_data_shortcut("CausativeGene", gene_path())
  gender <- ox_data_shortcut("Gender", gene_path())

  single <- ox_group_by_spec(gene)
  expect_length(single$paths, 1)
  expect_equal(single$names, "CausativeGene")
  expect_null(names(single$paths))

  pair <- ox_group_by_spec(list(gene, gender))
  expect_equal(pair$names, c("CausativeGene", "Gender"))

  # Serialises as a JSON array even with one entry.
  json <- jsonlite::toJSON(list(groupByPaths = single$paths), auto_unbox = TRUE)
  expect_match(as.character(json), "\"groupByPaths\":\\[\\{")
})

test_that("ox_group_by_spec rejects strings and more than two paths", {
  gene <- ox_data_shortcut("CausativeGene", gene_path())
  expect_error(ox_group_by_spec("Causative gene"), "ox_data_shortcut")
  expect_error(ox_group_by_spec(list(gene, gene, gene)), "at most two")
})

grouped_payload <- function(json) {
  jsonlite::fromJSON(json, simplifyVector = FALSE)
}

test_that("grouped payloads become one labelled row per group", {
  payload <- grouped_payload(paste0(
    '{"groups":[',
    '{"values":["t:Gene_NEB"],"labels":["NEB"],"count":7},',
    '{"values":["t:Gene_TPM2"],"labels":["TPM2"],"suppressed":true}]}'
  ))
  rows <- ox_parse_grouped_payload(payload, "CausativeGene", function(g) {
    list(count = as.integer(g$count %||% NA))
  })

  expect_equal(rows$CausativeGene, c("NEB", "TPM2"))
  expect_equal(rows$CausativeGene_value, c("t:Gene_NEB", "t:Gene_TPM2"))
  expect_equal(rows$suppressed, c(FALSE, TRUE))
  expect_equal(rows$count, c(7L, NA))
})

test_that("grouped results combine per group and flag suppressed cells", {
  site <- function(neb, tpm2) {
    data.frame(
      CausativeGene = c("NEB", "TPM2"),
      CausativeGene_value = c("t:Gene_NEB", "t:Gene_TPM2"),
      suppressed = c(is.na(neb), is.na(tpm2)),
      count = c(neb, tpm2)
    )
  }
  sum_counts <- function(rows) {
    data.frame(count = sum(do.call(rbind, rows)$count))
  }

  result <- ox_combine_grouped(
    list(site(5L, 4L), site(6L, NA)),
    "CausativeGene",
    sum_counts
  )

  expect_equal(result$CausativeGene, c("NEB", "TPM2"))
  expect_equal(result$count, c(11L, 4L))
  expect_equal(result$sites, c(2L, 2L))
  expect_equal(result$suppressed_sites, c(0L, 1L))
})
