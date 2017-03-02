var width = 960,
    height = 500,
    centered;


var projection = d3.geoMercator()
  .scale(width / 2 / Math.PI)
  .translate([width / 2, height / 1.5]);

// Center map in... Barcelona 41.3851° N, 2.1734° E
// var projection = d3.geoMercator()
//   .center([2.1734, 41.3851])
//   .scale(50000)

var path = d3.geoPath()
  .projection(projection);

console.log(path)
  
var svg = d3.select("#container").append("svg")
  .attr("id", "chart")
  .attr("viewBox", "0 0 960 500")
  .attr("preserveAspectRatio", "xMidYMid")
  .attr("width", width)
  .attr("height", height);

svg.append("rect")
    .attr("class", "background")
    .attr("width", width)
    .attr("height", height)
    .on("click", clicked);

// svg.append("rect")
//   .attr("width", width)
//   .attr("height", height)
//   .style("fill", "none")
//   .style("pointer-events", "all")
//   .call(d3.zoom()
//       .scaleExtent([1 / 2, 4])
//       .on("zoom", zoomed));

// function zoomed() {
//   var transform = d3.event.transform;
//   d3.select("path").attr("transform", function(d) {
//     return "translate(" + transform.applyX(d[0]) + "," + transform.applyY(d[1]) + ")";
//   });
// }

var map = svg.append("g")
  .attr("class", "map");




d3.json("data/world50m.json", function(error, topology) {
	if (error) throw error;
  //console.log(topology);

  var states = topojson.feature(topology, topology.objects.countries).features;

  // map
  //   .selectAll("path")
  //   .data(states)
  //   .enter()
  //   .append("path")
  //     .attr("d", path)
  //     .on("mousemove", function(d) {
		// 	  $(this).addClass("highlight")
		//   })
		//   .on("mouseout", function(d) {
		// 	  $(this).removeClass("highlight")
		//   });

  map.append("g")
      .attr("id", "states")
    .selectAll("path")
      .data(states)
    .enter().append("path")
      .attr("d", path)
      .on("click", clicked);

  map.append("path")
      .datum(topojson.mesh(topology, topology.objects.countries, function(a, b) { return a !== b; }))
      .attr("id", "state-borders")
      .attr("d", path);  

  d3.json("data/organisations_geo.json", function(error, data) {
    console.log(data);

    var geoData = data.filter(function(d) { return d.longitude != null; })

    // var maxData = d3.max(geoData, function(d) { return d.address.length; })
    // var minData = d3.min(geoData, function(d) { return d.address.length; })
    // var rScale = d3.scaleSqrt()
    //   .domain([maxData, minData])
    //   .range([5, 20]);
     
    var circles = map.append("g")
      .attr("id", "dots")
      .selectAll("circle")
        .data(geoData)
      .enter()
        .append("circle")
          .attr("cx",function(d) { return projection([d.longitude,d.latitude])[0]; })
          .attr("cy",function(d) { return projection([d.longitude,d.latitude])[1]; })
          .attr("r",function(d, i) {
            return 1;
            //return i/100; //Barcelona
          });



    d3.json("data/projects.json", function(error, prjs) {
      
      data.forEach(function(o, i){
        o.linked_project_ids.forEach(function(l, k){
          prjs.forEach(function(p, j){
            if(!p.points) p.points = []
            if(p.project_id == l){
              p.points.push([+o.longitude, +o.latitude])
            }
          })
        })
      })

      var morethanone = prjs.filter(function(d, i){
        return d.points.length>2
      })

      var features = []
      morethanone.forEach(function(p, i){
        features.push({type:'Feature', properties: p, geometry:{coordinates:[p.points], type:'Polygon'}})
      })

      var label = svg.append('text').attr('x', 20).attr('y', height-30)

      var arcs = svg.append('g')
        .selectAll('path')
        .data(features)
        .enter()
        .append('path')
        .attr('d', path)
        .style('fill', 'none')
        .style('stroke', 'red')
        .style('stroke-width', 1)

      var scl = d3.scaleLinear()
        .domain([0, width])
        .range([0, features.length])

      svg.call(d3.drag().on('start', function(){
        d3.event.on('drag', function(){
          var x = d3.event.x
          var index = parseInt(scl(x))
          arcs.attr('opacity', function(d, i){
            if(i == index) label.text(d.properties.project_name)
            return (i == index) ? 1 : 0
          })
        }).on('end', function(){
          arcs.attr('opacity', 1)
        })
      }))

    })




    
  });

});



function clicked(d) {
  var x, y, k;

  if (d && centered !== d) {
    var centroid = path.centroid(d);
    x = centroid[0];
    y = centroid[1];
    k = 8; //k = 8 ok for coutries
    centered = d;
  } else {
    x = width / 2;
    y = height / 2;
    k = 1;
    centered = null;
  }

  map.selectAll("path")
    .classed("active", centered && function(d) { return d === centered; });

  map.transition()
    .duration(750)
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
    .style("stroke-width", 0.5 / k + "px");

  d3.selectAll("circle").transition()
    .duration(750)
    .attr("r",function(d) {
      var kscale = k>1 ? .5 : 2;
      return kscale;
    });
}



// Responsive
  var chart = $("#chart"),
      aspect = chart.width() / chart.height(),
      container = chart.parent();
  var resize = function() {
      var targetWidth = container.width();
      chart.attr("width", targetWidth);
      chart.attr("height", Math.round(targetWidth / aspect));
  };
  $(window).on("resize", resize).trigger("resize");
  $(window).on("ready", resize).trigger("resize");