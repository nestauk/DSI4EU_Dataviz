function MapView() {
	var self = this;
	const map_path = 'data/world50m.json';


	//CREATE MAP
	self.create = function() {
		
		var width = $("#main-view").width(),
		    height = $("#main-view").height();

		var geoData = APP.dataset.orgs.filter(function(d) { return d.longitude != null; })

		var projection = d3.geoMercator()
		  .scale(width/2)
		  .translate([width/2, height/2]);

		var projection = d3.geoMercator()
		  .center([36, 64])
		  .scale(500)

		var path = d3.geoPath()
		  .projection(projection);

		var svg = d3.select("#main-view").append("svg")
		  .attr("id", "mapSvg")
		  .attr("width", width)
		  .attr("height", height);

		var map = svg.append("g")
  		.attr("class", "map");


  	d3.json(map_path, function(error, topology) {
			if (error) throw error;
		  //console.log(topology);

		  var states = topojson.feature(topology, topology.objects.countries).features;

		  map.append("g")
		      .attr("id", "states")
		    .selectAll("path")
		      .data(states)
		    .enter().append("path")
		      .attr("d", path)

		  map.append("path")
		      .datum(topojson.mesh(topology, topology.objects.countries, function(a, b) { return a !== b; }))
		      .attr("id", "state-borders")
		      .attr("d", path);
     
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
	          });
		  })

	} //END create


	//REMOVE MAP
	self.delete = function() {
		$("#mapSvg").remove();
	} //END remove
	

}