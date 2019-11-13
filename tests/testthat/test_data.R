context("'data' argument")

test_that("'data' argument gives error if not a dataframe or matrix", {
    d <- c(1:10)
    testthat::expect_error(excelTable(data = d), c("'data' must be either a matrix or a data frame, cannot be integer"))
})

test_that("valid 'data' object is passed to htmlwidget", {
  d <- matrix(1:100, ncol=10)
  testthat::expect_s3_class(suppressWarnings(excelTable(data=d))$x$data, "json")
})


test_that("'data' object with NA", {
  d <- data.frame(Model = c('Mazda', NA, 'Honda Fit', 'Honda CRV'),
                  Date = as.Date(c('2006-01-01', '2005-01-01', NA, '2003-01-01' )),
                  Availability = c(NA, FALSE, TRUE, TRUE),
                  Count = c(1, NA, NA, NA))

  e <- structure("[[\"Mazda\",\"2006-01-01\",null,1],[null,\"2005-01-01\",false,null],[\"Honda Fit\",null,true,null],[\"Honda CRV\",\"2003-01-01\",true,null]]", class = "json")

  testthat::expect_equal(suppressWarnings(excelTable(data = d))$x$data, e)
})

test_that("valid 'data' object is passed to htmlwidget", {
  d <- data.frame(Model = c('Mazda', 'Pegeout', 'Honda Fit', 'Honda CRV'),
                   Availability = c(TRUE, FALSE, TRUE, TRUE))
  testthat::expect_s3_class(suppressWarnings(excelTable(data=d))$x$data, "json")
})

test_that("'digits' parameter", {
  d <- data.frame(a = 0.123456789)
  e1 <- structure("[[0.1235]]", class = "json")
  e2 <- structure("[[0.123456789]]", class = "json")
  e3 <- structure("[[0.1]]", class = "json")
  testthat::expect_equal(suppressWarnings(excelTable(data = d))$x$data, e1)
  testthat::expect_equal(suppressWarnings(excelTable(data = d, digits = NA))$x$data, e2)
  testthat::expect_equal(suppressWarnings(excelTable(data = d, digits = 1))$x$data, e3)
})
