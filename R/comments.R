#' Add comment to a specified cell
#'
#' This function is used to add comment to the specified cell
#' @export
#' @param tableId the id of the table for which the comment is to be added
#' @param cellId the id of the cell for which the comment is to be added
#' @param comment the comment that is to be added to the cell
#' @examples
#' if(interactive()) {
#'  library(shiny)
#'  library(excelR)
#'  shinyApp(
#'   ui = fluidPage(excelOutput("table", height = 175),
#'        actionButton('comment', 'Set Comments to cell A1')),
#'      server = function(input, output, session) {
#'          output$table <- renderExcel(excelTable(data = head(iris)))
#'          observeEvent(input$comment,{
#'              setComments("table", "A1", "This is a comment")
#'          })
#'      }
#'      )
#'  }
setComments <- function(tableId, cellId, comment) {
  session <- shiny::getDefaultReactiveDomain()
  session$sendCustomMessage("excelR:setComments", message=list(tableId, cellId, comment))
}

#'
#' This function is used to get comment from specified cell
#' @export
#' @param tableId the id of the table from which the comment is to be fetched
#' @param cellId the id of the cell from which the comment is to be fetched
#' @examples
#' if(interactive()) {
#'  library(shiny)
#'  library(excelR)
#'  shinyApp(
#'      ui = fluidPage(excelOutput("table", height = 175),
#'           actionButton('comment', 'Get Comments from cell A1')),
#'      server = function(input, output, session) {
#'          output$table <- renderExcel(excelTable(data = head(iris)))
#'          observeEvent(input$comment, {
#'              getComments("table", "A1")
#'          })
#'          observeEvent(input$table, {
#'          print(input$table$comment)
#'          })
#'      }
#'      )
#'  }
getComments <- function(tableId, cellId) {
  session <- shiny::getDefaultReactiveDomain()
  session$sendCustomMessage("excelR:getComments", message=list(tableId, cellId))
}
