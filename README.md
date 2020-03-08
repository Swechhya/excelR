# excelR
[![version](https://www.r-pkg.org/badges/version/excelR)](https://CRAN.R-project.org/package=excelR)
[![CRAN_Download_Badge](https://cranlogs.r-pkg.org/badges/grand-total/excelR)](https://cran.r-project.org/package=excelR)
[![Travis-CI Build Status](https://travis-ci.org/Swechhya/excelR.svg?branch=master)](https://travis-ci.org/Swechhya/excelR)
[![AppVeyor Build Status](https://ci.appveyor.com/api/projects/status/github/Swechhya/excelR?branch=master&svg=true)](https://ci.appveyor.com/project/Swechhya/excelR)
[![codecov](https://codecov.io/gh/Swechhya/excelR/branch/master/graph/badge.svg)](https://codecov.io/gh/Swechhya/excelR)
![R Build and Checks](https://github.com/Swechhya/excelR/workflows/R%20Build%20and%20Checks/badge.svg?branch=master)

An R interface to [jExcel](https://bossanova.uk/jexcel/v3/) library to create web-based interactive tables and spreadsheets compatible with 'Excel' or any other spreadsheet software.

## Installation
To install the stable CRAN version: 
```r
install.packages('excelR')
```

To install the latest development version from GitHub:
```r
library(devtools)
install_github('Swechhya/excelR')
```

## Simple example
```r
library(excelR)

 data = data.frame(Model = c('Mazda', 'Pegeout', 'Honda Fit', 'Honda CRV'),
                   Date=c('2006-01-01', '2005-01-01','2004-01-01', '2003-01-01' ),
                   Availability = c(TRUE, FALSE, TRUE, TRUE))

 columns = data.frame(title=c('Model', 'Date', 'Availability'),
                      width= c(300, 300, 300),
                      type=c('text', 'calendar', 'checkbox')) 

 excelTable(data=data, columns = columns)
```

![excelTable](inst/images/basic_example.png "A simple example")

This package can be used in `shiny`
```r
  library(shiny)
  library(excelR)

   shinyApp(
     ui = fluidPage(excelOutput("table")),
     server = function(input, output, session) {
       output$table <-
      renderExcel(excelTable(data = head(iris)))
      }
    )

```

## Features:
- Insert and delete rows and columns.
- Excel formulas integration
- Drag and drop columns
- Resizable rows and columns
- Merge rows and columns
- Search
- Pagination
- Lazy loading
- Native color picker
- Data picker dropdown with autocomplete, multiple, and icons feature
- Date picker


