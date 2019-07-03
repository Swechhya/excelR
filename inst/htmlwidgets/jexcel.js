HTMLWidgets.widget({
  name: "jexcel",

  type: "output",

  factory: function(el, width, height) {
    var elementId = el.id;
    var container = document.getElementById(elementId);

    return {
      renderValue: function(params) {
        const { rowHeight,...otherParams } = params;

        const rows = (() => {
          if (rowHeight) {
            const rows = {};
            rowHeight.map(data => (rows[data[0]] = { height: `${data[1]}px` }));
            return rows;
          }
          return {};
        })();

        jexcel(container, {
          ...otherParams,
          rows,
          tableOverflow: true,
        });
      },

      resize: function(width, height) {
        //Need to implement
      }
    };
  }
});
