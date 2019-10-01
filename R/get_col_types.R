# Get column types of the given data
get_col_types <-  function(data) {

  if(is.data.frame(data)){

    colTypes <-  as.character(lapply(data,class))

  }else if(is.matrix(data)){

    colTypes <-  rep(typeof(data), ncol(data))

  }else {

    stop("'data' must be either a matrix or a data frame, cannot be ",
         class(data))
  }
  mappedColTypes <- sapply(colTypes, function(colType){
    switch(colType,
           factor = "dropdown",
           integer="integer",
           double="numeric",
           logical="checkbox",
           Date="calendar",
           numeric="numeric",
           "text")
  })

  as.character(mappedColTypes)
}

# If any of the auto detected column is dropdwon add the source
add_source_for_dropdown_type <- function(data, columns) {

# Check if any the data contains 'dropdown' type
  if(any(as.vector(columns$type) == 'dropdown')){
    colWithDropdown <- which(columns$type == 'dropdown')

    get_source_for_dropdown_type <- function(col){
      if(any(colWithDropdown == col)){
      list(levels(data[[col]]))
      }else{
        0;
      }
    }

    # Make the required format
    source <- sapply(seq(ncol(data)), get_source_for_dropdown_type)
    columns$source <- I(source);
  }

  columns;
}
