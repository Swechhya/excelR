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
          var showToolbar = params.hasOwnProperty("showToolbar")? params.showToolbar: false;
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
