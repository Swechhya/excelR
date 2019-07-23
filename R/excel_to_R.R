#' Convert excel object to data.frame
#'
#' This function is used to excel data to data.frame. Can be used in shiny app to convert input json to data.frame
#' @export
#' @param excelObj the json data retuned from excel table
#' @examples
#'if(interactive()){
#'  library(shiny)
#'  library(excelR)
#'  shinyApp(
#'    ui = fluidPage(excelOutput("table")),
#'    server = function(input, output, session) {
#'      output$table <-
#'        renderExcel(excelTable(data = head(iris)))
#'      observeEvent(input$table,{
#'        print(excel_to_R(input$table))
#'      })
#'    }
#'  )
#'}

excel_to_R <- function(excelObj) {
   if (!is.null(excelObj)) {
      data <- excelObj$data
      colHeaders <- excelObj$colHeaders
      dataOutput <- do.call(rbind.data.frame, data)
      rownames(dataOutput) <- NULL
      colnames(dataOutput) <- unlist(colHeaders)

      return(dataOutput)
   }

}
