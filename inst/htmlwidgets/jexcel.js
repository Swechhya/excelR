HTMLWidgets.widget({
  name: "jexcel",

  type: "output",

  factory: function(el, width, height) {
    var elementId = el.id;
    var container = document.getElementById(elementId);
    var excel =null;

    return {
      renderValue: function(params) {
        var rowHeight = params.hasOwnProperty("rowHeight") ? params.rowHeight : undefined;
        var otherParams = {};
        Object.keys(params).forEach(function(ky) {
          if(params !== "rowHeight" && params !== "otherParams") {
            otherParams[ky] = params[ky];
          }
        });
  
        var rows = (function() {
          if (rowHeight) {
            const rows = {};
            rowHeight.map(data => (rows[data[0]] = { height: `${data[1]}px` }));
            return rows;
          }
          return {};
        })();

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

        // If new instance of the table   
        if(excel === null) {
          excel =  jexcel(container, otherParams);
          
          return;
        }

        var  selection  = excel.selectedCell;

        while (container.firstChild) {
          container.removeChild(container.firstChild);
      }

        excel = jexcel(container, otherParams);
        excel.updateSelectionFromCoords(selection[0], selection[1], selection[2], selection[3]);

      },

      resize: function(width, height) {

      },

      onChange: function(obj){
        if (HTMLWidgets.shinyMode) {
      
          Shiny.setInputValue(obj.id, 
            {
              data:this.data, 
              colHeaders: this.colHeaders
            })
        }
      },

      onChangeHeader: function(obj, column, oldValue, newValue){
        debugger;
        if (HTMLWidgets.shinyMode) {
          var newColHeader = this.colHeaders;
          newColHeader[parseInt(column)] = newValue;

          Shiny.setInputValue(obj.id, 
            {
              data:this.data, 
              colHeaders: newColHeader
            })
        }
      }
    };
  }
});
