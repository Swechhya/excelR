HTMLWidgets.widget({
  name: "jexcel",

  type: "output",

  factory: function(el, width, height) {
    var elementId = el.id;
    var container = document.getElementById(elementId);

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

        jexcel(container, otherParams);
          // tableHeight: height,
          // tableWidth: width,
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
      }
    };
  }
});
