context("'autoColType' argument")

test_that("'autoColType' returns null when data is null ", {

  testthat::expect_null(excelTable()$x$autoColType)
})

test_that("'autoColType' returns null when 'data' is not null and 'autoColType' is FALSE", {
  d <- matrix(1:100, ncol=10)
  testthat::expect_null(suppressWarnings(excelTable(data = d, autoColType = FALSE)$x$autoColType))
})

test_that("'autoColType' returns null when 'data' is not null and 'type' attribute in column is specified", {
  data <- data.frame(Model = c('Mazda', 'Pegeout', 'Honda Fit', 'Honda CRV'),
                  Date=c('2006-01-01', '2005-01-01','2004-01-01', '2003-01-01' ))

columns <-  data.frame(title=c('Model', 'Date' ),
                     width= c(300, 300),
                     type=c('text', 'calendar'))
  testthat::expect_null(suppressWarnings(excelTable(data = data, columns=columns)$x$autoColType))
})

test_that("'autoColType' returns valid values when 'data' is not null and 'type' attribute in columns is not specified", {
  data <- data.frame(Model = c('Mazda', 'Pegeout', 'Honda Fit', 'Honda CRV'),
                  Date=c('TRUE', 'FALSE', 'TRUE', 'TRUE' ))

   testthat::expect_s3_class(suppressWarnings(excelTable(data = data))$x$columns, "json")
})
