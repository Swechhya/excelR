#' Get selected cells from excel table
#'
#' This function is used to the data selected in excel table
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
#'        print(get_selected_data(input$table))
#'      })
#'    }
#'  )
#'}

get_selected_data<- function(excelObj) {
   if (!is.null(excelObj)) {
      data <- excelObj$data
      dataOutput <- do.call(rbind.data.frame, data)
      rownames(dataOutput) <- NULL
      colnames(dataOutput) <- NULL

      return(dataOutput)
   }

}
