test_that("nemaline shortcut lookup returns a shortcut object", {
  shortcut <- ox_nemaline_shortcut("BaselineAge")

  expect_s3_class(shortcut, "ox_data_shortcut")
  expect_equal(shortcut$name, "BaselineAge")
  expect_s3_class(shortcut$path, "ox_graph_path")
})

test_that("nemaline shortcut lookup is case-insensitive", {
  shortcut <- ox_nemaline_shortcut("baseline age")

  expect_equal(shortcut$name, "BaselineAge")
})

test_that("nemaline shortcut catalog returns named shortcuts", {
  shortcuts <- ox_nemaline_shortcuts()

  expect_true("KaplanMeierTime" %in% names(shortcuts))
  expect_s3_class(shortcuts$KaplanMeierTime, "ox_data_shortcut")
})
