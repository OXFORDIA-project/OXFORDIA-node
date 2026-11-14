test_that("nemaline shortcut lookup returns a shortcut object", {
  shortcut <- ox_nemaline_shortcut("BaselineAge")

  expect_s3_class(shortcut, "ox_data_shortcut")
  expect_equal(shortcut$name, "BaselineAge")
  expect_s3_class(shortcut$path, "ox_graph_path")
})

test_that("nemaline shortcut lookup is case-insensitive", {
  expect_equal(ox_nemaline_shortcut("baseline age")$name, "BaselineAge")
  expect_equal(ox_nemaline_shortcut("currentFN")$name, "CurrentFN")
})

test_that("nemaline shortcut catalog includes derived fields", {
  shortcuts <- ox_nemaline_shortcuts()

  for (name in c("ZScoreH", "ZScoreW", "CurrentFN", "AmbGainTime")) {
    expect_true(name %in% names(shortcuts))
  }
  expect_s3_class(shortcuts$CausativeGene, "ox_data_shortcut")
})

test_that("the Participant shortcut has no steps", {
  path <- ox_nemaline_shortcut("Participant")$path

  expect_length(path$steps, 0)
  expect_false(is.null(path$start))
})

test_that("unknown shortcuts list the available names", {
  expect_error(ox_nemaline_shortcut("Nope"), "Unknown nemaline shortcut")
})
