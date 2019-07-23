context("'mergeCells' argument")

test_that("'mergeCells' argument gives error if not a list", {
  mc <- 1
  testthat::expect_error(excelTable(mergeCells = mc))
})


test_that("'mergeCells' argument gives error if not a list of vector", {
  mc <- list(a=data.frame())
  testthat::expect_error(excelTable(mergeCells = mc))
})

test_that("'mergeCells' argument gives error if not a list of vector with length 2", {
  mc <- list(c=(1))
  testthat::expect_error(excelTable(mergeCells = mc))
})


test_that("valid 'mergeCells' argument is passed to htmlwidget ", {
  mc <- list(A1=c(1,2))
  testthat::expect_type(excelTable(mergeCells = mc)$x$mergeCells, "list")
})


context("'style' argument")

test_that("'style' argument gives error if not a list", {
  s <- 1
  testthat::expect_error(excelTable(style = s))
})

test_that("valid 'style' argument is passed to htmlwidget ", {
  mc <- list("A1" = "background-color: gray;")
  testthat::expect_type(excelTable(style = mc)$x$style, "list")
})

