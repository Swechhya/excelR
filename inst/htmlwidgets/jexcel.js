HTMLWidgets.widget({
  name: "jexcel",

  type: "output",

  factory: function(el, width, height) {
    var elementId = el.id;
    var container = document.getElementById(elementId);

    return {
      renderValue: function(params) {
        const { rowHeight,style, ...otherParams } = params;

        const rows = (() => {
          if (rowHeight) {
            const rows = {};
            rowHeight.map(data => (rows[data[0]] = { height: `${data[1]}px` }));
            return rows;
          }
          return {};
        })();
        
        const formattedStyle = (()=>{
          if(style){
            const formattedStyle = Object.keys(style).reduce((acc, cur)=>({...acc, [cur]:style[cur].join(';')}),{})
            return formattedStyle
          }

          return {};
        })()

        jexcel(container, {
          ...otherParams,
          rows,
          tableOverflow: true,
          style: formattedStyle,
          // tableHeight: height,
          // tableWidth: width,
        });
      },

      resize: function(width, height) {
    
      }
    };
  }
});
