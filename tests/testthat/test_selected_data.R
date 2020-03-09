context("get_selected_data")

test_that("'get_selected_data' return null when excelObj is null ", {

  testthat::expect_null(get_selected_data(NULL))
})


test_that ("'get_selected_data' return a data frame when excelObj is not null", {
  data <- matrix(1:50, ncol=5)
  excelObj <- list(selectedData=c(unname(as.data.frame(data))), colHeaders=as.list(c(rep("",5))), forSelectedVals = TRUE)
  testthat::expect_s3_class(get_selected_data(excelObj), "data.frame")
})

context("get_selected_data_boundary") 

test_that("'get_selected_data_boundary' return null when excelObj is null ", {

  testthat::expect_null(get_selected_data_boundary(NULL))
})

test_that ("'get_selected_data_boundary' return a list when excelObj is not null", {
  data <- matrix(1:50, ncol=5)
  excelObj <- list(selectedData=c(unname(as.data.frame(data))), colHeaders=as.list(c(rep("",5))), forSelectedVals = TRUE, 
  selectedDataBoundary=list(borderLeft=1, borderTop=1, borderRight=1, borderBottom=1))
  testthat::expect_type(get_selected_data_boundary(excelObj), "list")
})