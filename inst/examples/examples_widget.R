### table example ---
library(excelR)

data = data.frame(Model = c('Mazda', 'Pegeout', 'Honda Fit', 'Honda CRV'),
                  Date=c('2006-01-01', '2005-01-01','2004-01-01', '2003-01-01' ),
                  Availability = c(TRUE, FALSE, TRUE, TRUE))


columns = data.frame(title=c('Model', 'Date', 'Availability'),
                     width= c(300, 300, 300),
                     type=c('text', 'calendar', 'checkbox'))

excelTable(data=data, columns = columns)

### no arguments with matrix ----
excelTable(matrix(1:20, ncol=4))

### some additional arguments with mtcars ----
library(excelR)

# for now we need to manipulate a data.frame with rownames
mtcars2 <- cbind(name = rownames(mtcars), mtcars, stringsAsFactors = FALSE)
mtcars2$name <- rownames(mtcars)
# change rownames so jsonlite will not convert to a column
rownames(mtcars2) <- seq_len(nrow(mtcars2))

excelTable(
  data = mtcars2,
  colHeaders = toupper(colnames(mtcars2)), # upper case the column names
  fullscreen = TRUE,  # fill screen with table
  columnDrag = TRUE,  # allow dragging (reordering) of columns
  rowDrag = FALSE, # disallow dragging (reordering) of rows
  wordWrap = TRUE, # wrap text in a cell if is longer than cell width
)

# an empty table
excelTable(
  data = NULL,
  minDimensions = c(5,20) # columns, rows
)


### styling cells ----
library(excelR)

excelTable(
  data = matrix(1:100, ncol = 10),
  style = list(
    "A1" = 'background-color: orange; fontWeight: bold; color: white;',
    "B1" = 'background-color: orange;',
    "C1" = 'background-color: orange;',
    "D1" = 'background-color: orange;'
  )
)
