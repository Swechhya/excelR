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
           factor = "text",
           integer="integer",
           double="numeric",
           logical="checkbox",
           Date="calendar",
           numeric="numeric",
           "text")
  })

  as.character(mappedColTypes)
}
