context("'data' argument")

test_that("'data' argument gives error if not a dataframe or matrix", {
    d <- c(1:10)
    testthat::expect_error(excelTable(data = d), c("'data' must be either a matrix or a data frame, cannot be integer"))
})

test_that("valid 'data' object is passed to htmlwidget", {
  d <- matrix(1:100, ncol=10)
  testthat::expect_s3_class(suppressWarnings(excelTable(data=d))$x$data, "json")
})
