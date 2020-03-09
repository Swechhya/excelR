context("excelObj")

test_that("'excel_to_R' return null when excelObj is null ", {

  testthat::expect_null(excel_to_R(NULL))
})


test_that ("'excel_to_R' return data frame when excelObj is not null", {
  data <- matrix(1:50, ncol=5)
  excelObj <- list(data=c(unname(as.data.frame(data))), colHeaders=as.list(c(rep("",5))), forSelectedVals = FALSE)
  testthat::expect_s3_class(excel_to_R(excelObj), "data.frame")
})

test_that("'excel_to_R' returns character variable when the field is text", {
  data <- data.frame(L = c(LETTERS[1:5]), N = c(1:5), stringsAsFactors= FALSE)
  excelObj <- list(data=apply(unname(data),1,as.list), colHeaders=as.list(c("Letters", "Numbers")), colType=as.list(c("text", "text")), forSelectedVals = FALSE)
  testthat::expect_equal(typeof(excel_to_R(excelObj)$Letters) , "character")
})

test_that("'excel_to_R' returns date variable when the field is text", {
  data <- data.frame(L = c(LETTERS[1:5]), stringsAsFactors= FALSE)
  data$date <- Sys.Date()
  excelObj <- list(data=apply(unname(data),1,as.list), colHeaders=as.list(c("Letters", "Date")), colType=as.list(c("text", "calendar")), forSelectedVals = FALSE)
  testthat::expect_equal(inherits(excel_to_R(excelObj)$Date[[1]], 'Date'), TRUE)
})

test_that ("'excel_to_R' return data frame when excelObj is not null and getSelectedData is true", {
  dataVal <- matrix(1:50, ncol=5)
  excelObj <- list(fullData=list(data=c(unname(as.data.frame(dataVal))), colHeaders=as.list(c(rep("",5)))), forSelectedVals = TRUE)
  testthat::expect_s3_class(excel_to_R(excelObj), "data.frame")
})