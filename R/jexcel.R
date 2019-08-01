#' Create excel table using jexcel library
#'
#' This function is used to create excel like table
#' @export
#' @param data a data object, can either be dataframe or a matrix.
#' @param columns a dataframe containing different column attributes.
#' The row number  of the dataframe specifies the column for which the attribute is to be specified and
#' the header of the dataframe specifies the attribute.The following attributes are supported:
#'  \itemize{
#'   \item \strong{title:} a string specifying title of the column or the column header.
#'   \item \strong{width:} a numerical value specifying the width of the column.
#'   \item \strong{type:} the type of the column. It can be one of text, numeric, hidden, dropdown,
#'   autocomplete, checkbox, radio, calendar, image or color.
#'   \item \strong{source:} a vector of options for column when the type is 'dropdwown'.
#'    \item \strong{multiple:} a boolean value indicating if the multiple options can be selected when the type is 'dropdown'.
#'    The default value is false.
#'    \item \strong{render:} a character value indicating if we want to render color for 'color' type instead of text. If render
#'    is provided a value 'square', color is rendered instead of text.
#'   \item \strong{readOnly:} a boolean value specifying the readonly column.
#' }
#' @param colHeaders a vector of specifying the column headers. If both 'colHeaders' and 'title' attribute
#' in columns is specified, the latter will take precedence.
#' @param rowHeight a dataframe or matrix specifying height of different rows. The first column consists of numerical value that
#' specifies the row number and the second column is also numerical value that specifies the height in pixels.
#' @param nestedHeaders a list of dataframe having title and colspan as the attributes. The nested header
#' in the same level should be in the same dataframe.
#' @param defaultColWidth a numeric value specifying the default width of column when the width attribute of column is not specified.
#' The default value is 50.
#' @param minDimensions a vector that defines the minimum number of rows and columns in the tables irrespective of the size of data.
#' The first parameter should be of number of columns followed by number of rows. If data is null then it will create an empty table
#' with the given dimensions.
#' @param columnSorting a boolean value indicating if column sorting should be enabled. When enabled double click
#' on the table headers sorts the column. By default it is set to true.
#' @param columnDrag a boolean value indicating if column dragging is enabled. By default it is set to false.
#' @param columnResize a boolean value indicating if column resizing is enabled. By default it is set to true.
#' @param rowResize a boolean value indicating if row resizing is enabled. By default it is set to false.
#' @param rowDrag a boolean value indicating if rowDragging is enabled or not. By default it is set to true.
#' @param editable a boolean value indicating if the table can be edited. By default it is set to true
#' @param allowInsertRow a boolean value indicating if user is allowed to insert new rows. By default it is set to true.
#' @param allowInsertColumn a boolean value indicating if user is allowed to insert a new column. By default it is set to true.
#' @param allowDeleteRow  a boolean value indicating if user is allowed to delete a row. By default it is set to true.
#' @param allowDeleteColumn a boolean value indicating if user is allowed to delete a column. By default it is set to true.
#' @param allowRenameColumn a boolean value indicating if user is allowed to rename the columns. By default it is set to true
#' @param allowComments a boolean value indicating if commenting on cell should be enabled. By default it is set to false.
#' @param wordWrap a boolean value indicating if words in the cells should wrap. By default it is set to false.
#' @param selectionCopy a boolean value indicating if user is allowed to copy selected cells. By default it is set to true.
#' @param mergeCells a list containing vector of colspan and rowspan respectively such that the tag  of the list specifies the
#' cell number.
#' @param search a boolean value indicating if search should be enabled. By default it is set to false.
#' @param pagination a numeric value indicating number of rows in a single page. If the data does not fit in a
#' single page pagination is enabled.
#' @param fullscreen a boolean value indicating if the table should be fullscreen. By default it is set to false.
#' @param lazyLoading a boolean value indicating if lazy loading should be enabled. By default it is set to false.
#' @param loadingSpin a boolean value indicating if loading spinner should be enabled. By default it is set to false.
#' @param style a named list to specify style for each cell. The name should be the cell address and the value should be
#' a valid 'css' string with styles.  For example, to style cell 'A1', the list should look like
#' \code{style = list("A1" = "background-color: gray;")}.
#' @import jsonlite
#' @import htmlwidgets
#' @example inst/examples/examples_widget.R
excelTable <-
  function(data = NULL,
           columns = NULL,
           colHeaders = NULL,
           rowHeight = NULL,
           nestedHeaders = NULL,
           defaultColWidth = NULL,
           minDimensions = NULL,
           columnSorting = TRUE,
           columnDrag = FALSE,
           columnResize = TRUE,
           rowResize = FALSE,
           rowDrag = TRUE,
           editable = TRUE,
           allowInsertRow = TRUE,
           allowInsertColumn = TRUE,
           allowDeleteRow = TRUE,
           allowDeleteColumn = TRUE,
           allowRenameColumn = TRUE,
           allowComments = FALSE,
           wordWrap = FALSE,
           selectionCopy = TRUE,
           mergeCells = NULL,
           search = FALSE,
           pagination = NULL,
           fullscreen = FALSE,
           lazyLoading = FALSE,
           loadingSpin = FALSE,
           style = NULL) {
    # List of parameters to send to js
    paramList <- list()

    # Check data
    if (!is.null(data))
    {
      # It either has to be dataframe or matrix
      if (is.data.frame(data) || is.matrix(data)) {
        paramList$data <- jsonlite::toJSON(data, dataframe = "values")
      } else {
        stop("'data' must be either a matrix or a data frame, cannot be ",
             class(data))
      }

    }

    # Check column
    # If both columns and colHeaders are not specified, use the column names of the dataframe/matrix
    if (is.null(columns) && is.null(colHeaders)) {
      if (!is.null(data)) {
        warning(
          "Since both column title and colHeaders are not specified 'data' column name will be used as column headers"
        )
        paramList$colHeaders = colnames(data)
      }

    } else if (is.null(columns) && !is.null(colHeaders)) {
      # If columnheader is specified

      #Check if column header is a vector
      if (!is.vector(colHeaders)) {
        stop("'colHeaders' must be a vector, cannot be ",
             class(colHeaders))
      }

      #Check is the column header length is equal to no. of columns
      if (!is.null(data)) {
        if (ncol(data) != length(colHeaders)) {
          stop(
            "length of 'colHeader' should be equal the number of columns in the 'data', 'data' has ",
            ncol(data),
            "but the length of 'colHeader' is ",
            length(colHeaders)
          )
        }
      }

      paramList$colHeaders <- jsonlite::toJSON(colHeaders)


    } else if (!is.null(columns))
    {
      #Check if 'columns' is a dataframe
      if (!is.data.frame(columns)) {
        stop("'columns' must be a dataframe, cannot be ", class(columns))
      }

      #Check if number of rows in 'columns' is equal to the number of columns in 'data'
      if (!is.null(data)) {
        if (nrow(columns) != ncol(data))
        {
          stop(
            "number of rows in 'columns' should be equal to number of columns in 'data', expected number of rows in 'columns' to be ",
            ncol(data),
            " but got ",
            nrow(columns)
          )
        }
      }

      #Check if title attribute is present in column
      if (!"title" %in% colnames(columns)) {
        if (is.null(colHeaders)) {
          if (!is.null(data)) {
            warning(
              "Since both column title and colHeaders are not specified 'data' column name will be used as column headers"
            )
            paramList$colHeaders = jsonlite::toJSON(colnames(data))
          }

        } else{
          paramList$colHeaders = jsonlite::toJSON(colHeaders)
        }

      }

      # Check if all the attributes in the columns is a valid attribute i.e. colname(columns) should be subset of attributes
      colAttributes <-
        c("title", "width", "type", "source", "multiple", "render", "readOnly")
      if (!all(colnames(columns) %in% colAttributes)) {
        warning(
          "unknown attribute(s) ",
          colnames(columns)[!colnames(columns) %in% colAttributes],
          " for 'columns' found, ignoring those attribute(s)"
        )
      }

      paramList$columns <-
        jsonlite::toJSON(columns[colnames(columns) %in% colAttributes])

    }

    #Check row height
    if (!is.null(rowHeight)) {
      if (!is.data.frame(rowHeight) && !is.matrix(rowHeight)) {
        stop("'rowHeight' must either be a matrix or a dataframe, cannot be ",
             class(rowHeight))
      }
      if (ncol(rowHeight) != 2) {
        stop(
          "'rowHeight' must either be a matrix or a dataframe with two columns, but got ",
          ncol(rowHeight),
          " column(s)"
        )
      }

      paramList$rowHeight <-
        jsonlite::toJSON(rowHeight, dataframe = "values")
    }

    if (!is.null(nestedHeaders)) {
      # nestedHeaders should be list
      if (!is.list(nestedHeaders)) {
        stop("'nestedHeaders' must be a list of dataframe(s), cannot be ", 
        class(nestedHeaders))
      }

      headerAttributes <- c("title", "colspan")

      for (nestedHeader in nestedHeaders) {
        # nestedHeaders should be list of data.frames
        if (!is.data.frame(nestedHeader))
        {
          stop(
            "'nestedHeaders' must be a list of dataframe(s), but got list of  ",
            class(nestedHeader),
            "(s)"
          )
        }

        # data.frame nestedHeaders should have atleast two column and one row
        if (ncol(nestedHeader) < 2 || nrow(nestedHeader) < 1) {
          stop(
            "the dataframe(s) in 'nestedHeaders must contain at least two columns and one row, 'title' and 'colspan', but got only ",
            ncol(nestedHeader),
            " column and ",
            nrow(nestedHeader),
            " row"
          )
        }

        # the dataframe in nestedHeaders should have one column named as title
        if (!"title" %in% colnames(nestedHeader)) {
          stop(
            "one of the column in the dataframe in list of 'nestedHeaders' should have 'title' as header which will be used as title of the nested header"
          )
        }


        # the dataframe in nestedHeaders should have one column named as colspan
        if (!"colspan" %in% colnames(nestedHeader)) {
          stop(
            "one of the column in the dataframe in list of 'nestedHeaders' should have 'colspan' as header which will be used to determine the number of column it needs to span"
          )
        }

        # extra columns in dtaframes in nestedHeaders will be ignored
        if (!all(colnames(nestedHeader) %in% headerAttributes)) {
          warning(
            "unknown headers(s) ",
            colnames(nestedHeader)[!colnames(nestedHeader) %in% headerAttributes],
            " for 'nestedHeader' found, ignoring column with those header(s)"
          )
        }

      }

      paramList$nestedHeaders <-
        jsonlite::toJSON(nestedHeaders, dataframe = "rows")
    }

    if (!is.null(defaultColWidth)) {
      if (!is.numeric(defaultColWidth) || length(defaultColWidth) > 1) {
        stop("'defaultColWidth' must be a numeric value of length 1 but got ",
             class(defaultColWidth), " of length ", length(defaultColWidth))
      }

      paramList$defaultColWidth <- defaultColWidth
    }


    # Check minDimensions
    if (!is.null(minDimensions)) {
      # minDimensions must be a vector
      if (!is.vector(minDimensions)) {
        stop("'minDimensions' must be vector but got ",
             class(minDimensions))
      }

      # minDimensions must be length of 2
      if (length(minDimensions) != 2) {
        stop(
          "'minDimensions' must be a vector of length of 2 but got length of ",
          length(minDimensions)
        )
      }

      paramList$minDimensions <- minDimensions
    }

    # Check logical arguments
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
      "fullscreen",
      "lazyLoading",
      "loadingSpin"
    )) {
      argvalue <- get(arg)
      if(!is.null(argvalue)) {
        # now check these arguments to make sure they are logical
        if(is.logical(argvalue)) {
          paramList[[arg]] <- argvalue
        } else {
          warning("Argument ", arg, " should be either TRUE or FALSE.  Ignoring ", arg, ".", call. = FALSE)
          paramList[[arg]] <- NULL
        }
      }
    }

    # Check mergeCells
    if (!is.null(mergeCells)) {
      # mergeCells should be a list
      if (!is.list(mergeCells)) {
        stop("expected 'mergeCells' to be a list but got ",
             class(mergeCells))
      }

      for (mergeCell in mergeCells) {
        if (!is.vector(mergeCell)) {
          stop(
            "expected each parameter in 'mergeCells' list to be a vector but got ",
            class(mergeCell)
          )
        }

        if (length(mergeCell) != 2) {
          stop(
            "expected each parameter in 'mergeCells' list to be a vector of length  2 but got vector of length ",
            length(mergeCells)
          )
        }
      }

      paramList$mergeCells <- mergeCells

    }

    # Check pagination
    if (!is.null(pagination)) {
      if (!is.numeric(pagination) || length(pagination) > 1) {
        stop("'pagination' must be an integer of length 1 but got ",
             class(pagination), " of length ", length(pagination))
      }

      paramList$pagination <- pagination
    }

    # Check style
    if (!is.null(style)) {
      if (!is.list(style)) {
        stop("'style' should be a list but got ", class(style))
      }

      paramList$style <- style
    }

    # create the widget
    htmlwidgets::createWidget(
      name = "jexcel",
      x = paramList,
      width = if(fullscreen)'100%' else 0,
      height = if(fullscreen ) '100%' else 0,
      package = 'excelR',
    )
  }
