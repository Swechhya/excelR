#' Helper function for using jexcel table in Shiny
#'
#' Shiny bindings for excel table
#' @export
#' @param  outputId output variable to read from.
#' @param  width,height must be a valid CSS unit in pixel or a number, which will be coerced to a string and "px" appended.
#' @import htmlwidgets
#' @examples
#' if(interactive()) {
#'   library(shiny)
#'   library(excelR)
#'   shinyApp(
#'     ui = fluidPage(excelOutput("table")),
#'     server = function(input, output, session) {
#'       output$table <-
#'      renderExcel(excelTable(data = head(iris)))
#'      }
#'    )
#' }
#' @seealso \code{\link{renderExcel}}
excelOutput <- function(outputId, width = "100%", height = "400px") {
  htmlwidgets::shinyWidgetOutput(outputId, "jexcel", width, height, package = "excelR")
}

#' Helper function for using jexcel table in Shiny
#'
#' Shiny bindings for excel table
#' @export
#' @param expr an expression that generates an excelTable.
#' @param env the environment in which to evaluate expr.
#' @param quoted is expr a quoted expression(with quote())? This is useful if you want to save an expression in a variable.
#' @import htmlwidgets
#' @examples
#' if(interactive()) {
#'   library(shiny)
#'   library(excelR)
#'   shinyApp(
#'     ui = fluidPage(excelOutput("table")),
#'     server = function(input, output, session) {
#'       output$table <-
#'      renderExcel(excelTable(data = head(iris)))
#'      }
#'    )
#' }
#' @seealso \code{\link{excelOutput}}
renderExcel <- function(expr, env = parent.frame(), quoted = FALSE) {
  if (!quoted) { expr <- substitute(expr) } # force quoted
  htmlwidgets::shinyRenderWidget(expr, excelOutput, env, quoted = TRUE)
}
