context("excelObj")

test_that("'excel_to_R' return null when excelObj is null ", {

  testthat::expect_null(excel_to_R(NULL))
})


test_that ("'excel_to_R' return data frame when excelObj is not null", {
  data <- matrix(1:50, ncol=5)
  excelObj <- list(data=c(unname(as.data.frame(data))), colHeaders=as.list(c(rep("",5))))
  testthat::expect_s3_class(excel_to_R(excelObj), "data.frame")
})
