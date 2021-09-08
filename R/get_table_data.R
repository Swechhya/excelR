#'
#' This function is used to get data from excel table
#' @export
#' @param tableId the id of the table from which the comment is to be fetched
#' @examples
#' if(interactive()) {
#'  library(excelR)
#'  library(shiny)
#'      shinyApp(
#'          ui = fluidPage(actionButton('get', 'Get table data'),
#'              tableOutput("fetchedData"),
#'              excelOutput("table", height = 175)),
#'          server = function(input, output, session) {
#'              output$table <- renderExcel(excelTable(data = head(iris)))
#'          
#'              observeEvent(input$get,{getTableData("table")})
#' 
#'              observeEvent(input$table,{
#'                  output$fetchedData <- renderTable(excel_to_R(input$table))
#'              })
#' })
#' 
getTableData <- function(tableId) {
  session <- shiny::getDefaultReactiveDomain()
  session$sendCustomMessage("excelR:getTableData", message=list(tableId))
}
