#' Create excel table using jexcel library
#'
#' This function is used to create excel like table
#' @export
#' @param data a data object, can either be dataframe or a matrix
#' @param columns a datframe containing the attributes of columns in the table.
#' The row number  of the dataframe specifies the column for with the attribute is to be specified
#' Each header of the dataframe specifies the attribute.The following attributes are supported:
#'  \itemize{
#'   \item \strong{title:} the title of the column or the column header
#'   \item \strong{width:} the width of the column
#'   \item \strong{type:} the type of the column. It can be one of text, numeric, hidden, dropdown,
#'   autocomplete, checkbox, radio, calendar, image or color
#'   \item \strong{source:} the options for column whose type is 'dropdwown'.
#'    We need to specify the source if type of column is 'dropdown'
#'    \item \strong{multiple:} used to specify if the multiple options can be selected if the type is 'dropdown'.
#'    The default value is false.
#' }
#' @param colHeaders the column header, vector of column headers. If both colHeader and title attribute
#' in columns is specified, the latter will take precedence
#' @param rowHeight a dataframe or matrix specifying heights of different rows. The first column specifies
#' the row number while the second column speicifies the height in pixels
#' @param nestedHeaders a list of dataframe having title and colspan as the attributes. The nested header
#' in the same level should be in the same dataframe
#' @param minDimensions a vector that defines the minimum dimension size of the table irrespective of the size of data,
#' the first parameter should be of column followed by row. If data is null then it will create an empty table with the given
#' dimensions
#' @param search a boolean value indicating if search should be enabled
#' @param pagination numeric value indicating number of rows in a single page
#' @param allowComments a boolean value indicating if commenting on cell should be enabled
excel <- function(data = NULL, columns = NULL, colHeaders = NULL, rowHeight = NULL, nestedHeaders = NULL,
                  minDimensions = NULL, search = FALSE, pagination = NULL, allowComments = FALSE,
                  mergeCells = NULL, columnSorting = FALSE, lazyLoading = TRUE, loadingSpin = TRUE,
                  style = NULL, width = NULL, height = NULL, elementId = NULL) {

  # List of parameters to send to js
  paramList <- list();

  # Check data
  if(!is.null(data))
  {
    # It either has to be dataframe or matrix
    if(is.data.frame(data) || is.matrix(data)){
      paramList$data <- jsonlite::toJSON(data, dataframe = "values")
    }else {
      stop(
        "'data' must be either a matrix or a data frame, cannot be ",
        class(data)
      )
    }

  }


  # Check column
  # If both columns and colHeaders are not specified, use the column names of the dataframe/matrix
  if(is.null(columns) && is.null(colHeaders) ){
    if(!is.null(data)){
      warning("Since both column title and colHeaders are not specified 'data' column name will be used as column headers")
      paramList$colHeaders = colnames(data)
    }

  }else if (is.null(columns) && !is.null(colHeaders)){
    # If columnheader is specified

    #Check if column header is a vector
    if(!is.vector(colHeaders)){
      stop("'colHeader' must be a vector, cannot be", class(colHeaders))
    }

    #Check is the column header length is equal to no. of columns
    if(!is.null(data)){

      if(ncol(data) != length(colHeaders)){

        stop("length of 'colHeader' should be equal the number of columns in the 'data', 'data' has ",
             ncol(data), "but the length of 'colHeader' is ", length(colHeaders) )
      }
    }

    paramList$colHeaders <- jsonlite::toJSON(colHeaders);

  }else if(!is.null(columns))
  {
    #Check if 'columns' is a dataframe
    if(!is.data.frame(columns)){
      stop("'columns' must be a dataframe, cannot be", class(columns))
    }

    #Check if number of rows in 'columns' is equal to the number of columns in 'data'
    if(!is.null(data)){

      if(nrow(columns) != ncol(data))
      {
        stop("number of rows in 'columns' should be equal to number of columns in 'data', expected number of rows in 'columns' to be ",
             ncol(data), "but got ", nrow(columns))
      }
    }

    #Check if title attribute is present in column
    if(!"title" %in% colnames(columns)){

      if(is.null(colHeaders)){
        if(!is.null(data))
        {
          warning("Since both column title and colHeaders are not specified 'data' column name will be used as column headers")
          paramList$colHeaders = jsonlite::toJSON(colnames(data))
        }

      }else{
        paramList$colHeaders = jsonlite::toJSON(colHeaders)
      }

    }

    # Check if all the attributes in the columns is a valid attribute i.e. colname(columns) should be subset of attributes
    colAttributes <- c("title", "width", "type", "source", "multiple")
    if(!all(colnames(columns) %in% colAttributes)){
      warning("unknown attribute(s) ",colnames(columns)[!colnames(columns)%in%colAttributes], " for 'columns' found, ignoring those attributes")
    }

    paramList$columns <- jsonlite::toJSON(columns[colnames(columns)%in%colAttributes])

  }

  #Check row height
  if(!is.null(rowHeight)){
    if (!is.data.frame(rowHeight) && !is.matrix(rowHeight)){
      stop(
        "'rowHeight' must be either a matrix or a dataframe, cannot be ",
        class(rowHeight)
      )
    }
    if(ncol(rowHeight) != 2){
      stop("'rowHeight' must be either a matrix or dataframe with two columns, but got ",
           ncol(rowHeight), " column(s)")
    }

    paramList$rowHeight <- jsonlite::toJSON(rowHeight, dataframe = "values")
  }

  if(!is.null(nestedHeaders)) {

    # nestedHeaders should be list
    if(!is.list(nestedHeaders)){
      stop("'nestedHeaders' must be a list of dataframe(s), cannot be ",
           class(nestedHeaders))
    }

    headerAttributes <- c("title", "colspan")

    for( nestedHeader in nestedHeaders){

      # nestedHeaders should be list of data.frames
      if(!is.data.frame(nestedHeader))
      {
        stop("'nestedHeaders' must be a list of dataframe(s), but got list of  ",
             class(nestedHeader), "(s)")
      }

      # data.frame nestedHeaders should have atleast two column and one row
      if(ncol(nestedHeader) < 2 || nrow(nestedHeader) < 1){
        stop("the dataframe(s) in 'nestedHeaders must contain at least two columns and one row,
             'title' and 'colspan', but got only ", ncol(nestedHeader),
             " column and ", nrow(nestedHeader), " row" )
      }

      # the dataframe in nestedHeaders should have one column named as title
      if(!"title" %in% colnames(nestedHeader)){
        stop("one of the column in the dataframe in list of 'nestedHeaders' should have 'title' as header
             which will be used as title of the nested header")
      }


      # the dataframe in nestedHeaders should have one column named as colspan
      if(!"colspan" %in% colnames(nestedHeader)){
        stop("one of the column in the dataframe in list of 'nestedHeaders' should have 'colspan' as header
             which will be used to determine the number of column it needs to span")
      }

      # extra columns in dtaframes in nestedHeaders will be ignored
      if(!all(colnames(nestedHeader) %in% headerAttributes)){
        warning("unknown headers(s) ",colnames(nestedHeader)[!colnames(nestedHeader)%in%headerAttributes],
                " for 'nestedHeader' found, ignoring column with those header(s)")
      }

    }

    paramList$nestedHeaders <- jsonlite::toJSON(nestedHeaders, dataframe = "rows")
  }


  # Check minDimensions
  if(!is.null(minDimensions)){

    # minDimensions must be a vector
    if(!is.vector(minDimensions)){
      stop("'minDimensions' must be vector but got ", class(minDimensions))
    }

    # minDimensions must be length of 2
    if(length(minDimensions) != 2){
      stop("'minDimensions' must be a vector of length but got length of ", length(minDimensions))
    }

    paramList$minDimensions <- minDimensions
  }

  # Search
  if(search) {
    paramList$search <- TRUE
  }

  # Check pagination
  if(!is.null(pagination)){

    if(!is.numeric(pagination)){
      stop("'pagination' must be an integer but got ", class(pagination))
    }

    paramList$pagination <- pagination
  }

  if(allowComments) {
    paramList$allowComments <- TRUE
  }



  # create the widget
  htmlwidgets::createWidget(
    name= "jexcel",
    x = paramList,
    width = width,
    height = height,
    package = 'excelR',
    elementId = elementId )
}
