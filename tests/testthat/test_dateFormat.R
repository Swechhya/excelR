context("'dateFormat' argument")

test_that("'dateFormat' argument gives warning for invalid format", {
    testthat::expect_warning(excelTable(dateFormat= 'MM/DD/YYY'))
})

test_that("valid 'dateFormat' argument is passed to htmlwidget ", {
  testthat::expect_type(excelTable(dateFormat = 'MM-DD-YYY')$x$dateFormat,  "character")
})

