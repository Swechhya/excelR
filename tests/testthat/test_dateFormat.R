context("'dateFormat' argument")

test_that("valid 'dateFormat' argument is passed to htmlwidget ", {
  testthat::expect_type(excelTable(dateFormat = 'MM-DD-YYY')$x$dateFormat,  "character")
})

