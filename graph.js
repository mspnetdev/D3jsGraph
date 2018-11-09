var width = 960,
    height = 500,
    activeClassName = 'active-d3-item';

var svg = d3.select('body').append('svg');
svg.attr('width', width);
svg.attr('height', height);
svg.attr('id', 'd3Container');

//feed by json
// //The data for our lines and endpoints
// var data = [ 
//   {
//     'x1': 350, 
//     'y1': 15,
//     'x2': 250,
//     'y2': 33,
//     'stroke': 'gray',
//     'id' : 'line1'
//     // 'stroke-width': 5
//   },  
//   { 
//     'x1': 420,  
//     'y1': 420,
//     'x2': 250,
//     'y2': 333,
//     'stroke': 'red',
//     'id' : 'line2'
//     // 'stroke-width': 7
//   }
// ];

d3.json("http://localhost:8000/data.json", function(error, treeData) {
    var data = treeData;
    //update(root);

    // Generating the svg lines attributes
    var lineAttributes = {
        'x1': function(d) {
            return d.x1;
        },
        'y1': function(d) {
            return d.y1;
        },
        'x2': function(d) {
            return d.x2;
        },
        'y2': function(d) {
            return d.y2;
        },
        'stroke': function(d) {
            return d.stroke;
        },
        'id': function(d) {
            return d.id;
        }
        // 'stroke-width': function(d) {
        //     return d.stroke-width;
        // }
    };
    
    var drag = d3.behavior.drag()
    .origin(function(d) { return d; })
    .on('dragstart', dragstarted)
    .on('drag', dragged)
    .on('dragend', dragended);

    // Pointer to the d3 lines
    var lines = svg
    .selectAll('line')
        .data(data)
    .enter()
        .append('line')
            .attr(lineAttributes)
            .call(drag);

    function dragstarted() {
        d3.select(this).classed(activeClassName, true);
    }
});

// events

function dragged() {
    var x = d3.event.dx;
    var y = d3.event.dy;
    
    var line = d3.select(this);
    
    // Update the line properties
    var attributes = {
      x1: parseInt(line.attr('x1')) + x,
      y1: parseInt(line.attr('y1')) + y,

      x2: parseInt(line.attr('x2')) + x,
      y2: parseInt(line.attr('y2')) + y,
    };
  
    line.attr(attributes);
}

function dragended() {
    d3.select(this).classed(activeClassName, false);

    var lastPosition = {
        id: this.id,    

        x1: this.x1.baseVal.valueInSpecifiedUnits,
        y1: this.y1.baseVal.valueInSpecifiedUnits,

        x2: this.x2.baseVal.valueInSpecifiedUnits,
        y2: this.y2.baseVal.valueInSpecifiedUnits
    }

    //var myJSON = JSON.stringify(lastPosition);
    
    var objs = d3.selectAll(svg[0][0].childNodes);

    objs.forEach(element => {
        var newJson = '[';
        element.forEach(element2 => {
            if(newJson === '[')
            {
                newJson = newJson + JSON.stringify(element2.__data__);
            }
            else
            {
                newJson = newJson + ',' + JSON.stringify(element2.__data__);
            }
        });
        newJson = newJson + ']'
    });


}