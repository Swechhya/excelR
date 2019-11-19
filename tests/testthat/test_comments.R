context("'setComments' argument")

test_that("'setComments' does not work outside shiny", {
  testthat::expect_error(setComments())
})


context("'getComments' argument")

test_that("'getComments' does not work outside shiny", {
  testthat::expect_error(getComments())
})