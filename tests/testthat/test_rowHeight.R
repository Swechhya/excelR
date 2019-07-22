context("'rowHeight' argument")

test_that("'rowHeight' argument gives error if not a dataframe or a matrix", {
  r <- c(1:10)
  testthat::expect_error(excelTable(rowHeight = r), "'rowHeight' must either be a matrix or a dataframe, cannot be integer")
})

test_that("'rowHeight' argument gives error if number of columns is not 2", {
  r <- matrix(1:10, ncol = 1)
  testthat::expect_error(excelTable(rowHeight = r))
})

test_that("valid 'rowHeight' argument is passed to htmlwidget ", {
  r <- matrix(1:10, ncol = 2)
  testthat::expect_s3_class(suppressWarnings(excelTable(rowHeight = r))$x$rowHeight, "json")
})
