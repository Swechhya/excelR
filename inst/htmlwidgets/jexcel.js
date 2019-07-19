HTMLWidgets.widget({
  name: "jexcel",

  type: "output",

  factory: function(el, width, height) {
    var elementId = el.id;
    var container = document.getElementById(elementId);

    return {
      renderValue: function(params) {
        var rowHeight = params.hasOwnProperty("rowHeight") ? params.rowHeight : undefined;
        var style = params.hasOwnProperty("style") ? params.style : undefined;
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

        // this is the only one I do not think I got right
        // also on the js docs I do not see an initialization property called formattedStyle
        // https://bossanova.uk/jexcel/v2/docs/quick-reference
        var formattedStyle = (function() {
          if(style){
            return Object.keys(style).reduce(function(acc, cur) {
              return [acc, style[cur]].join(';');
            });
          } else {
            return {};
          }
        })();

        otherParams.rows = rows;
        otherParams.tableOverflow = true;
        otherParams.style = formattedStyle;

        jexcel(container, otherParams);
          // tableHeight: height,
          // tableWidth: width,
      },

      resize: function(width, height) {

      }
    };
  }
});
