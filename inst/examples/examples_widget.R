### table example ---
library(excelR)

data = data.frame(Model = c('Mazda', 'Pegeout', 'Honda Fit', 'Honda CRV'),
                  Date=c('2006-01-01', '2005-01-01','2004-01-01', '2003-01-01' ),
                  Availability = c(TRUE, FALSE, TRUE, TRUE))


columns = data.frame(title=c('Model', 'Date', 'Availability'),
                     width= c(300, 300, 300),
                     type=c('text', 'calendar', 'checkbox'))

excelTable(data=data, columns = columns)

### columns parameter ----
# https://bossanova.uk/jexcel/v3/examples/column-types
data <- data.frame(Car = c("Jazz", "Civic"),
                   Make = c("Honda", "Honda" ),
                   Photo = c("https://images.unsplash.com/photo-1535498730771-e735b998cd64?ixlib=rb
                             -1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80",
                             "https://images.unsplash.com/photo-1533106497176-45ae19e68ba2?ixlib=rb
                             -1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80"),
                   Available = as.Date(c("2019-02-12", "2018-07-11")),
                   Stock = c(TRUE, TRUE),
                   Price = c(2000, 4000.01),
                   Color = c("#777700", "#007777"))

columns <- data.frame(title = colnames(data),
                      type = c("hidden", "dropdown", "image", "calendar",
                               "checkbox", "numeric", "color"),
                      width = c(120, 200, 200, 80, 100, 100, 100),
                      source = I(list(NA, c("Honda", "Alfa Romeo", "Audi", "Bmw"),
                                      NA, NA, NA, NA, NA)),
                      mask = c(NA, NA, NA, NA, NA, "$ #.##,00", NA),
                      decimal = c(NA, NA, NA, NA, NA, ",", NA),
                      render = c(NA, NA, NA, NA, NA, NA, "square"))

excelTable(data = data, columns = columns)

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

### custom formating ----
# conditional formats
library(excelR)

set.seed(1)
data <- matrix(sample(c(-1:1), size = 25, replace = TRUE), nrow = 5)

updateTable <- "function(instance, cell, col, row, val, label, cellName) {
            val = cell.innerText;
            if (val < 0) {
                cell.style.color = 'red';
            } else if (val > 0) {
                cell.style.color = 'green';
            } else {
                cell.style.color = 'orange';
            }
}"

excelTable(data = data, updateTable = htmlwidgets::JS(updateTable))

# example from  https://bossanova.uk/jexcel/v3/examples/table-scripting
library(excelR)

data <- jsonlite::fromJSON('[
    ["BR", "Cheese", 1, 3.99],
    ["CA", "Apples", 0, 1.00],
    ["US", "Carrots", 1, 0.90],
    ["GB", "Oranges", 0, 1.20],
    ["CH", "Chocolats", 1, 0.40],
    ["AR", "Apples", 1, 1.10],
    ["AR", "Bananas", 1, 0.30],
    ["BR", "Oranges", 1, 0.95],
    ["BR", "Pears", 1, 0.90],
    ["", "", "", "=ROUND(SUM(D1:D8), 2)"]
]')

columns <- jsonlite::fromJSON('[
  { "type": "autocomplete", "title":"Country", "width":"250", "url":"/jexcel/countries" },
  { "type": "autocomplete", "title":"Food", "width":"150",
      "source":["Apples","Bananas","Carrots","Oranges","Cheese","Kiwi","Chocolats","Pears"] },
  { "type": "checkbox", "title":"Stock", "width":"100" },
  { "type": "number", "title":"Price", "width":"100" }
  ]')

# url option to source in excelTable param columns
columns$source[1] <- list(jsonlite::fromJSON(paste0('https://bossanova.uk', columns$url[1])))
columns$url <- NULL

updateTable <- "function(instance, cell, col, row, val, label, cellName) {
        // Number formating
        if (col == 3) {
            // Get text
            txt = cell.innerText;

            // Format text
            txt = txt.replace('$ ','');

            // Update cell value
            cell.innerHTML = '$ ' + txt;
        }

        // Odd row colours
        if (row % 2) {
            cell.style.backgroundColor = '#edf3ff';
        }

        // Total row
        if (row == 9) {
            if (col < 3) {
                cell.innerHTML = '';
            }

            if (col == 2) {
                cell.innerHTML = 'Total';
                cell.style.fontWeight = 'bold';
            }

            cell.className = '';
            cell.style.backgroundColor = '#f46e42';
            cell.style.color = '#ffffff';
        }
    }"

excelTable(data = data, columns = columns, updateTable = htmlwidgets::JS(updateTable))
