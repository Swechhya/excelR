context("class")

test_that("excelTable makes a htmlwidget", {
  expect_is(excelTable(), "htmlwidget")
  expect_is(excelTable(), "jexcel")
})



context("logical arguments")
test_that("logical arguments are logical and if not become NULL", {
  for (arg in c(
        "columnSorting",
        "columnDrag",
        "columnResize",
        "rowResize",
        "rowDrag",
        "editable",
        "allowInsertRow",
        "allowInsertColumn",
        "allowDeleteRow",
        "allowDeleteColumn",
        "allowRenameColumn",
        "allowComments",
        "wordWrap",
        "selectionCopy",
        "search",
        "lazyLoading",
        "loadingSpin",
        "showToolbar",
        "autoWidth",
        "autoFill",
        "getSelectedData"
  )) {
    l <- list()
    l[[arg]] <- 'not logical'
    testthat::expect_warning(do.call(excelTable, l))
    testthat::expect_null(suppressWarnings(do.call(excelTable, l))$x[[arg]])
  }
})

test_that("valid logical arguments are passed to htmlwidget", {
  for (arg in c(
        "columnSorting",
        "columnDrag",
        "columnResize",
        "rowResize",
        "rowDrag",
        "editable",
        "allowInsertRow",
        "allowInsertColumn",
        "allowDeleteRow",
        "allowDeleteColumn",
        "allowRenameColumn",
        "allowComments",
        "wordWrap",
        "selectionCopy",
        "search",
        "lazyLoading",
        "loadingSpin",
        "showToolbar",
        "autoWidth",
        "getSelectedData"
  )) {
    l <- list()
    l[[arg]] <- TRUE
    testthat::expect_true(suppressWarnings(do.call(excelTable, l))$x[[arg]])
  }
})

