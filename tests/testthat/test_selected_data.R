context("get_selected_data")

test_that("'get_selected_data' return null when excelObj is null ", {

  testthat::expect_null(get_selected_data(NULL))
})


test_that ("'get_selected_data' return a data frame when excelObj is not null", {
  data <- matrix(1:50, ncol=5)
  excelObj <- list(data=c(unname(as.data.frame(data))), colHeaders=as.list(c(rep("",5))))
  testthat::expect_s3_class(excel_to_R(excelObj), "data.frame")
})
