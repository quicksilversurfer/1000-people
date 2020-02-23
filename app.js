// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 40},
  width = 1400 - margin.left - margin.right,
  height = 1400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
.append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
.append("g")
  .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

// tooltip
var tooltip = d3.select("body")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);


// load the data  
d3.json("data/data.json").then(data => {

  var nodes = data.nodes;
  var testLinks = data.edges;

  // find origin nodes
  const linkedByIndex = {};
  data.edges.forEach(d => {
    linkedByIndex[`${d.source},${d.target}`] = 1;
  });

  // find unique subjects
  const subjects = Object.keys(linkedByIndex);
  const subjectUnique = [];
  subjects.forEach( s => {
    let val = s.split(",")[0];
    if(subjectUnique.indexOf(val) === -1) {
      subjectUnique.push(parseInt(val));
    }
  });


  // Initialize the links
  var link = svg
    .selectAll("line")
    .data(data.edges)
    .enter().append("line");

  link  
    .attr("class", "link");
    // .on("mouseover.tooltip", function(d) {
    //   tooltip.transition()
    //     .duration(300)
    //     .style("opacity", 0.8);
    //   tooltip.html("<p/>Source: " + d.source.value +
    //     "<p/>Target: " + d.target.value)
    //     .style("left", (d3.event.pageX) + "px")
    //     .style("top", (d3.event.pageY) + "px");
    // })
    // .on("mouseout.fade", fade(1))
    // .on("mousemove", function() {
    //   tooltip.style("left", (d3.event.pageX) + "px")
    //     .style("left", (d3.event.pageY) + "px");
    // });


  // Initialize the nodes
  var node = svg
    .selectAll("g")
    .data(data.nodes)
    .enter().append("g")
    .attr("class", d => {
      let className;
      if(Object.values(subjectUnique).includes(d.node_id)) {
        className = "node subject";
      } else { className = "node"; }
      return className;
    });

  //append circles to nodes
  node.append("circle")
    .attr("r", d => {
      var radius;
      if(Object.values(subjectUnique).includes(d.node_id)) {
        radius = 10;
      } else { radius = 5; }
      return radius;
    })
    // .on("mouseover.tooltip", function(d) {
    //   tooltip.transition()
    //     .duration(300)
    //     .style("opacity", 0.8);
    //   tooltip.html("<p/>Name: " + d.value)
    //     .style("left", (d3.event.pageX) + "px")
    //     .style("top", (d.event.pageY) + "px");
    // })
    .on("mouseover.fade", fade(0.1))
    .on("mouseout.fade", fade(1));

  
  //append labels to nodes
  var labels = node.append("text")
    .text(d => d.value )
    .attr("x", 12)
    .attr("y", 4);


  // Let's list the force we wanna apply on the network
  var simulation = d3.forceSimulation(data.nodes)                 // Force algorithm is applied to data.nodes
      .force("link", d3.forceLink()                               // This force provides links between nodes
            .id( d => d.node_id )                     // This provide  the id of a node
            .links(data.edges)                                    // and this the list of links
      )
      .force("charge", d3.forceManyBody().strength(-100))         // This adds repulsion between nodes. Play with the -400 for the repulsion strength
      .force("center", d3.forceCenter(width / 2, height / 2))     // This force attracts nodes to the center of the svg area
      .on("end", ticked);

  // This function is run at each iteration of the force algorithm, updating the nodes position.
  function ticked() {
    link
        .attr("x1", d => d.source.x )
        .attr("y1", d => d.source.y )
        .attr("x2", d => d.target.x )
        .attr("y2", d => d.target.y );

    node
        .attr("transform", d => {
          return "translate(" + d.x + "," + d.y + ")";
        });
  }

  function isConnected(a, b) {
    return linkedByIndex[`${a.index},${b.index}`] || linkedByIndex[`${b.index},${a.index}`] || a.index === b.index;
  }

  function fade(opacity) {
    return d => {
      node.style('stroke-opacity', function (o) {
        const thisOpacity = isConnected(d, o) ? 1 : opacity;
        this.setAttribute('fill-opacity', thisOpacity);
        return thisOpacity;
      });
  
      link.style('stroke-opacity', o => (o.source === d || o.target === d ? 1 : opacity));
  
    };
  }

});



