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
      if( excelObj$forSelectedVals )
      {
         excelObj = excelObj$fullData
      }

      data <- excelObj$data
      colHeaders <- excelObj$colHeaders
      colType <- excelObj$colType
      dataOutput <- do.call(rbind.data.frame, data)

      # Change clandar variables to date
      if(any(colType == 'calendar')){
         dateVariables<- which(colType == 'calendar' )
         dataOutput[dateVariables] <- lapply(dataOutput[dateVariables], function(x)
          as.Date(gsub(pattern = "^$", replacement = NA, x = x))
         )
      }

      #if any of the column is not dropdown but is factor convert it to character
      factorCols <- which(sapply(dataOutput, is.factor))
      dropdownCols <- which(colType == 'dropdown')

      # At least one of the factor column is not dropdown,convert that to character
      if(length(factorCols) != length(dropdownCols) || !all(factorCols == dropdownCols)){
         diffCols <- setdiff(factorCols, dropdownCols)
         dataOutput[diffCols] <- lapply(dataOutput[diffCols], as.character)
      }

      rownames(dataOutput) <- NULL
      colnames(dataOutput) <- unlist(colHeaders)

      return(dataOutput)
   }

}
