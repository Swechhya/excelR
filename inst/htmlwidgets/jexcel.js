  HTMLWidgets.widget({
    name: "jexcel",
    
    type: "output",
    
    factory: function(el, width, height) {
      var elementId = el.id;
      var container = document.getElementById(elementId);
      var excel = null;
      
      return {
        renderValue: function(params) {
          var rowHeight = params.hasOwnProperty("rowHeight") ? params.rowHeight : undefined;
          var showToolbar = params.hasOwnProperty("showToolbar")? params.showToolbar: false;
          var dateFormat = params.hasOwnProperty("dateFormat")? params.dateFormat: "DD/MM/YYYY";
          var autoWidth = params.hasOwnProperty("autoWidth")? params.autoWidth: true;
          var autoFill = params.hasOwnProperty("autoFill")? params.autoFill: false;
          var getSelectedData = params.hasOwnProperty("getSelectedData")? params.getSelectedData: false
          var imageColIndex = undefined;
          var otherParams = {};
          
          Object.keys(params).forEach(function(ky) {
            if(ky !== "dateFormat" && 
            ky !== "rowHeight" && 
            ky !== "autoWidth" && 
            ky !== "getSelectedData" && 
            ky !== "otherParams" ) {
              // Check if the key is columns and check if the type is calendar, if yes add the date format
              if(ky === "columns"){
                otherParams[ky] = params[ky].map(function(column, index){
                  // If the date format is not default we'll need to pass it properly to jexcel table
                  if(column.type === "calendar" && dateFormat !== "DD/MM/YYYY"){
                    column.options = {format: dateFormat}
                  }
                  
                  // If image url is specified, we'll need to pass it to jexcel table only
                  // in updateTable function,so here we'll first find the column index. This 
                  if(column.type === "image"){
                    imageColIndex = index;
                  }
                  return column;
                });
                
                return;
              }
            }
            otherParams[ky] = params[ky];
          });
          
          var rows = (function() {
            if (rowHeight) {
              const rows = {};
              rowHeight.map(function(data) {
                return rows[data[0]] = { height: `${data[1]}px` 
              }
            });
            return rows;
          }
          return {};
        })();
        
        //Lets add the image url in the update table function
        if(imageColIndex){
          otherParams.updateTable = function (instance, cell, col, row, val, id) {
            if (col == imageColIndex && "data:image" != val.substr(0, 10)) {
              cell.innerHTML = '<img src="' + val + '" style="width:100px;height:100px">';
            }
          }
        }
        
        otherParams.rows = rows;
        otherParams.tableOverflow = true;
        otherParams.onchange = this.onChange;
        otherParams.oninsertrow = this.onChange;
        otherParams.ondeleterow = this.onChange;
        otherParams.oninsertcolumn = this.onChange;
        otherParams.ondeletecolumn = this.onChange;
        otherParams.onsort = this.onChange;
        otherParams.onmoverow = this.onChange;
        otherParams.onchangeheader = this.onChangeHeader;
        if(getSelectedData) {
          otherParams.onselection = this.onSelection;
        }
        
        if(showToolbar) {
          // Add toolbar to param
          otherParams.toolbar = [
            { type:'i', content:'undo', onclick:function() { excel.undo(); } },
            { type:'i', content:'redo', onclick:function() { excel.redo(); } },
            { type:'i', content:'save', onclick:function () { excel.download(); } },
            { type:'select', k:'font-family', v:['Arial','Verdana'] },
            { type:'select', k:'font-size', v:['9px','10px','11px','12px','13px','14px','15px','16px','17px','18px','19px','20px'] },
            { type:'i', content:'format_align_left', k:'text-align', v:'left' },
            { type:'i', content:'format_align_center', k:'text-align', v:'center' },
            { type:'i', content:'format_align_right', k:'text-align', v:'right' },
            { type:'i', content:'format_bold', k:'font-weight', v:'bold' },
            { type:'color', content:'format_color_text', k:'color' },
            { type:'color', content:'format_color_fill', k:'background-color' },
          ]
        }
        
        // If new instance of the table   
        if(excel === null) {
          excel =  jexcel(container, otherParams);
          
          if(autoWidth){
            excel.table.setAttribute("style", "width: auto; height: auto; white-space: normal;")
          }
          
          if(!autoWidth && autoFill){
            excel.table.setAttribute("style", "width: 100%; height: 100%; white-space: normal;")
            container.getElementsByClassName("jexcel_content")[0].setAttribute("style", "height:100%")
          }
          
          container.excel = excel;
          
          return;
        }
        
        var  selection  = excel.selectedCell;
        
        while (container.firstChild) {
          container.removeChild(container.firstChild);
        }
        
        excel = jexcel(container, otherParams);
        
        if(selection){
          excel.updateSelectionFromCoords(selection[0], selection[1], selection[2], selection[3]);
        }
        
        
        if(autoWidth){
          excel.table.setAttribute("style", "width: auto; height: auto; white-space: normal;")
        }
        
        if(!autoWidth && autoFill){
          excel.table.setAttribute("style", "width: 100%; height: 100%; white-space: normal;")
          container.getElementsByClassName("jexcel_content")[0].setAttribute("style", "height:100%")
        }
        
        container.excel = excel;
        
      },
      
      resize: function(width, height) {
        
      },
      
      onChange: function(obj){
        
        if (HTMLWidgets.shinyMode) {
          
          var changedData = getOnChangeData (this.data, this.columns, this.colHeaders);
          
          Shiny.setInputValue(obj.id, 
            {
              data:changedData.data, 
              colHeaders: changedData.colHeaders,
              colType: changedData.colType,
              forSelectedVals: false, 
            })
          }
        },
        
        onChangeHeader: function(obj, column, oldValue, newValue){
          
          if (HTMLWidgets.shinyMode) {
            
            var changedData = getOnChangeData (this.data, this.columns, this.colHeaders);
            
            var newColHeader = changedData.colHeaders;
            newColHeader[parseInt(column)] = newValue;
            
            Shiny.setInputValue(obj.id, 
              {
                data:changedData.data, 
                colHeaders: newColHeader,
                colType: changedData.colType,
                forSelectedVals: false, 
              })
            }
          },
          onSelection: function(obj, borderLeft, borderTop, borderRight, borderBottom, origin){
            if (HTMLWidgets.shinyMode) {
              // Get arrays between top to bottom, this will return the array of array for selected data
              var data =  this.data.reduce(function(acc, value, index){
                
                if(index >= borderTop && index <= borderBottom){
                  
                  var val = value.reduce(function(innerAcc, innerValue, innerIndex){
                    
                    if(innerIndex >= borderLeft && innerIndex <= borderRight){
                      
                      innerAcc.push(innerValue);
                    }
                    
                    return innerAcc;
                  },[])
                  
                  acc.push(val);
                }
                
                return acc;
              },[])
              
              var fullData =  getOnChangeData (this.data, this.columns, this.colHeaders);

              Shiny.setInputValue(obj.id, 
                {
                  fullData: fullData,
                  selectedData: data,
                  selectedDataBoundary:{
                    borderLeft, 
                    borderTop, 
                    borderRight, 
                    borderBottom
                  },
                  forSelectedVals: true
                })
                
              }
            }
          };
        }
      });
      
      
      if (HTMLWidgets.shinyMode) {
        
        // This function is used to set comments in the table
        Shiny.addCustomMessageHandler("excelR:setComments", function(message) {
          
          var el = document.getElementById(message[0]);
          if (el) {
            el.excel.setComments(message[1], message[2]);
          }
        });
        
        // This function is used to get comments  from table
        Shiny.addCustomMessageHandler("excelR:getComments", function(message) {
          
          var el = document.getElementById(message[0]);
          if (el) {
            var comments = message[1] ? el.excel.getComments(message[1]): el.excel.getComments(null);
            
            Shiny.setInputValue(message[0], 
              {
                comments
              });
            }
          });
        }
        
        
        function getOnChangeData (data, columns, colHeaders) {
          var colType = columns.map(function(column){
            return column.type;
          })
          
          
          if(colHeaders.every(function (val){return (val ==='')})){
            var colHeaders = columns.map(function(column){ return column.title})
          }
          
          return { data: data, colHeaders: colHeaders, colType: colType}
        }