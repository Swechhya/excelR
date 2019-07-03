#' @export
excelOutput <- function(outputId, width = "100%", height = "400px") {
  htmlwidgets::shinyWidgetOutput(outputId, "jexcel", width, height, package = "excelR")
}

#' @export
renderExcel <- function(expr, env = parent.frame(), quoted = FALSE) {
  if (!quoted) { expr <- substitute(expr) } # force quoted
  htmlwidgets::shinyRenderWidget(expr, excelOutput, env, quoted = TRUE)
}