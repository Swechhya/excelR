#' Get selected cells from excel table
#'
#' This function is used to get the data selected in excel table
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
#'        renderExcel(excelTable(data = head(iris), getSelectedData = TRUE))
#'      observeEvent(input$table,{
#'        print(get_selected_data(input$table))
#'      })
#'    }
#'  )
#'}

get_selected_data<- function(excelObj) {
   if (!is.null(excelObj) && excelObj$forSelectedVals) {
      data <- excelObj$selectedData
      dataOutput <- do.call(rbind.data.frame, data)
      rownames(dataOutput) <- NULL
      colnames(dataOutput) <- NULL

      return(dataOutput)
   }

}

#' Get selected cells boundary from excel table
#'
#' This function is used to the boundary points of data selected in excel table
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
#'        renderExcel(excelTable(data = head(iris), getSelectedData = TRUE))
#'      observeEvent(input$table,{
#'        print(get_selected_data_boundary(input$table))
#'      })
#'    }
#'  )
#'}
get_selected_data_boundary<- function(excelObj) {
   if (!is.null(excelObj) && excelObj$forSelectedVals) {
      boundaryIndex <- excelObj$selectedDataBoundary
      boundaryCell = lapply(boundaryIndex, function(x){x+1})
      return(boundaryCell)
   }
}
