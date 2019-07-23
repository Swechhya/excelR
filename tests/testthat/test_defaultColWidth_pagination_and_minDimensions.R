context("'defaultColWidth' arguments")

test_that("'defaultColWidth' argument gives error if not a numeric", {
  dc <- c(1:5)
  testthat::expect_error(excelTable(defaultColWidth = dc))
})


test_that("valid 'defaultColWidth' argument is passed to htmlwidget ", {
  dc <- 10
  testthat::expect_type(excelTable(defaultColWidth = dc)$x$defaultColWidth,  "double")
})

context("'minDimensions' arguments")

test_that("'minDimensions' argument gives error if not a vector", {
  md <- data.frame()
  testthat::expect_error(excelTable(minDimensions = md))
})

test_that("'minDimensions' argument gives error if not a vector of length 2", {
  md <- c(1:5)
  testthat::expect_error(excelTable(minDimensions = md))
})

test_that("valid 'minDimensions' argument is passed to htmlwidget ", {
  md <- c(5, 10)
  testthat::expect_type(excelTable(minDimensions = md)$x$minDimensions,  "double")
})

context("'pagination' arguments")

test_that("'pagination' argument gives error if not a numeric", {
  p <- c(1:5)
  testthat::expect_error(excelTable(pagination = p))
})


test_that("valid 'pagination' argument is passed to htmlwidget ", {
  dc <- 10
  testthat::expect_type(excelTable(pagination = dc)$x$pagination,  "double")
})
