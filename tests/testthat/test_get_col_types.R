context("get_col_types")

test_that("'get_col_types' argument gives error if 'data' not a dataframe or matrix", {
    d <- c(1:10)
    testthat::expect_error(get_col_types(data = d), c("'data' must be either a matrix or a data frame, cannot be integer"))
})

test_that("'get_col_types' argument gives character if 'data' a dataframe or matrix", {
  d <- matrix(1:100, ncol=10)
  testthat::expect_equal(get_col_types(data=d), rep("integer", 10))
})

test_that("'get_col_types' argument gives character if 'data' a dataframe or matrix", {
  d <- data.frame(Model = c('Mazda', 'Pegeout', 'Honda Fit', 'Honda CRV'), stringsAsFactors = TRUE)

  testthat::expect_equal(get_col_types(data=d), c("dropdown"))
})

test_that("'get_col_types' argument gives character if 'data' a dataframe or matrix", {
  d <- data.frame(Model = c('Mazda', 'Pegeout', 'Honda Fit', 'Honda CRV'),
                   Availability = c(TRUE, FALSE, TRUE, TRUE), stringsAsFactors = TRUE)
  testthat::expect_equal(get_col_types(data=d), c("dropdown", "checkbox"))
})

test_that("'get_col_types' argument gives character if 'data' a dataframe or matrix", {
  d <- data.frame(Model = c('Mazda', 'Pegeout', 'Honda Fit', 'Honda CRV'),
                    Date=c(as.Date('2006-01-01'), as.Date('2005-01-01'),
                    as.Date('2004-01-01'), as.Date('2003-01-01' )), stringsAsFactors = TRUE)

  testthat::expect_equal(get_col_types(data=d), c("dropdown", "calendar"))
})

test_that("'get_col_types' argument gives character if 'data' a dataframe or matrix", {
  d <- data.frame( value = c(0.1, 0.2, 0.3))
  testthat::expect_equal(get_col_types(data=d), c("numeric"))
})

test_that("'get_col_types' argument gives character if 'data' a dataframe or matrix", {
  d <- data.frame( value = LETTERS[1:10], stringsAsFactors = FALSE)
  testthat::expect_equal(get_col_types(data=d), c("text"))
})

test_that("'get_col_types' argument gives character if 'data' a dataframe or matrix", {
  d <- data.frame( value =  c(1, 2.5, 4.5) )
  testthat::expect_equal(get_col_types(data=d), c("numeric"))
})

test_that("'get_col_types' argument gives error if 'data' not a dataframe or matrix", {
    d <- 1
    testthat::expect_error(get_col_types(data = d), c("'data' must be either a matrix or a data frame, cannot be numeric"))
})

test_that("'get_col_types' argument gives character if 'data' a dataframe or matrix", {
  d <- matrix( c(as.double(1), as.double(2.5)), ncol=1)
  testthat::expect_equal(get_col_types(data=d), c("numeric"))
})
