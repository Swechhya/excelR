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
          tableHeight: "100%"
        });
        // data = [
        //     ['Mazda', 2001, 2000],
        //     ['Pegeout', 2010, 5000],
        //     ['Honda Fit', 2009, 3000],
        //     ['Honda CRV', 2010, 6000],
        // ];

        // jexcel(container, {
        //     data:data,
        //     columns:[
        //         { title:'Model', width:300, multiple:true, type: 'dropdown', source:['Mazda', 'Pegeout', 'Honda Fit', 'Honda CRV'] },
        //         { title:'Price', width:80 },
        //         { title:'Model', width:100 }
        //     ],
        //     colHeaders:['A', 'B', 'C'],
        // });
      },

      resize: function(width, height) {
        //Need to implement
      }
    };
  }
});
