context("'nestedHeaders' argument")

test_that("'nestedHeaders' argument gives error if not a list", {
  n <- 1
  testthat::expect_error(excelTable(nestedHeaders = n))
})


test_that("'nestedHeaders' argument gives error if not a list of dataframe", {
  n <- list(a=c('abc'))
  testthat::expect_error(excelTable(nestedHeaders = n))
})


test_that("'nestedHeaders' argument gives error if not a list of dataframe with two columns and one row", {
   n <- list(data.frame(c=(1)))
   testthat::expect_error(excelTable(nestedHeaders = n))
})

test_that("'nestedHeaders' argument gives error if not a list of dataframe with two columns and one row having
          column names 'title' and 'colspan'", {
  n <- list(data.frame(title=c("Plant Attribute"), colspans=c(5)))
  testthat::expect_error(excelTable(nestedHeaders = n))
})

test_that("valid 'nestedHeaders' argument is passed to htmlwidget ", {
  n <- list( data.frame(title=c("Plant Attribute"), colspan=c(5)),
             data.frame(title=c("Sepal Attributes", "Petal Attributes", "Species"),
                        colspan=c(2, 2, 1)))
  testthat::expect_s3_class(excelTable(nestedHeaders = n)$x$nestedHeaders, "json")
})

test_that("valid 'nestedHeaders' argument is passed to htmlwidget and invalid arguments are ignored",{
  n <- list( data.frame(title=c("Plant Attribute"), colspan=c(5), rowspan=c(5)),
             data.frame(title=c("Sepal Attributes", "Petal Attributes", "Species"),
                        colspan=c(2, 2, 1), rowspan=c(2,2,1)))
  testthat::expect_warning(excelTable(nestedHeaders = n))
  testthat::expect_s3_class(suppressWarnings(excelTable(nestedHeaders = n))$x$nestedHeaders, "json")
})

