context("'getTableData' function")

test_that("'getTableData' return null when excelObj is null ", {

  testthat::expect_null(excel_to_R(getTableData(NULL)))
})


test_that("'getTableData' does not work outside shiny", {
  testthat::expect_error(getTableData("table"))
})

