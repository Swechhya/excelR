context("'getTableData' function")

test_that("'getTableData' does not work outside shiny", {
  testthat::expect_error(getTableData("table"))
})

