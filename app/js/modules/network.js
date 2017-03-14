function NetworkView() {
	var self = this;

	/* returns a list of ORGs with shared PRJs */
	function findConnectedOrg(data, field) {
		var orgList = [];
	  data.forEach(function(d){
	  	if (d[field].length > 1) {
	  		d[field].forEach(function(e){
	  			orgList.push(e);
	  		});
	  	}
	  })
	  var cleanOrgList = _.uniq(orgList);
	  //console.log(cleanOrgList);
	  return cleanOrgList;
	}

	/* returns a list of PRJs belonging to connected ORGs */
	function findConnectedPrj(data, ConnectedOrgArray, field) {
		var prjList = [];
		var filteredData = data.filter(function (d) {
			return ConnectedOrgArray.includes(d.id);
		});
	  filteredData.forEach(function(d){
			d[field].forEach(function(e){
				prjList.push(e);
	  	});
	  });
	  var cleanPrjList = _.uniq(prjList);
	  return cleanPrjList;
	}


	//CREATE NETWORK
	self.create = function() {
		
		var width = $("#main-view").width(),
		    height = $("#main-view").height();

		var svg = d3.select("#main-view").append("svg")
		  .attr("id", "networkSvg")
		  .attr("width", width)
		  .attr("height", height);

		var color = d3.scaleOrdinal(["steelblue", "salmon"]);

		var simulation = d3.forceSimulation()
		  .force("link", d3.forceLink().id(function(d) { return d.id; }).strength(2))
		  //.force("charge", d3.forceManyBody())
		  .force("charge", d3.forceManyBody().strength(-150).distanceMax(100))
		  .force("center", d3.forceCenter(width / 2, height / 2));

		/* PREPARE AND CLEAN DATA */
		var org = [];
		var prj = [];
		APP.dataset.orgs.forEach(function (d) {
			var temp = {};
			var prjArray = _.map(d.linked_prjs, function (e) {
				return "prj"+e.id;
			});
			temp.type = 0;
			temp.id = "org"+d.id;
			temp.prjlinks = prjArray;
			temp.country = d.country;
			temp.name = d.name;
			org.push(temp);
		})
		//console.log(org);
		APP.dataset.prjs.forEach(function (d) {
			var temp = {};
			var orgArray = _.map(d.linked_orgs, function (e) {
				return "org"+e.id;
			});
			temp.type = 1;
			temp.id = "prj"+d.id;
			temp.orglinks = orgArray;
			temp.name = d.name;
			prj.push(temp);
		})
		//console.log(prj);
		
		var selectedOrgs = findConnectedOrg(org, "prjlinks"); //ORGs with shared PRJs
		var selectedPrjs = findConnectedPrj(prj, selectedOrgs, "orglinks"); //shared PRJs
		
		/* FILTER DATA */
		var filteredOrg = org.filter(function (d) {
			//return d.country!="";
			return d.country==="United Kingdom";
			//return selectedOrgs.includes(d.id);
		});
		var filteredPrj = prj.filter(function (d) {
			return d.id!="";
			//return selectedPrjs.includes(d.id);
		});

		/* BUILDS UP THE NODES (ORGs and PRJs) */
		var nodes = filteredOrg.concat(filteredPrj);

		/* BUILDS UP THE LINKS (connections between nodes), creating objects with SOURCE and TARGET fields */
		var links = [];
		filteredOrg.forEach(function (d) {
			d["prjlinks"].forEach(function(e){
				if (e.length!=0) {
					links.push({
						source: d.id.toString(),
						target: e,
						value: 1
					});
				}
			});
		})

		console.log(filteredOrg)
		console.log(org)
		
		var link = svg.append("g")
	      .attr("class", "links")
	    .selectAll("line")
	    .data(links)
	    .enter().append("line")
	      .attr("stroke-width", function(d) { return Math.sqrt(d.value); });

		var node = svg.append("g")
	      .attr("class", "nodes")
	    .selectAll("circle")
	    .data(nodes)
	    .enter().append("circle")
	      .attr("r", 5)
	      .attr("fill", function(d) { return color(d.type); })
	      .call(d3.drag()
	        .on("start", dragstarted)
	        .on("drag", dragged)
	        .on("end", dragended));

	  node.append("title")
	    .text(function(d) { return "id: "+d.id+", name: "+d.name; });

	  simulation
	    .nodes(nodes)
	    .on("tick", ticked);

	  simulation.force("link")
	    .links(links);

	  function ticked() {
	    link
	      .attr("x1", function(d) { return d.source.x; })
	      .attr("y1", function(d) { return d.source.y; })
	      .attr("x2", function(d) { return d.target.x; })
	      .attr("y2", function(d) { return d.target.y; });
	    node
	      .attr("cx", function(d) { return d.x; })
	      .attr("cy", function(d) { return d.y; });
	  }

	  function dragstarted(d) {
		  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
		  d.fx = d.x;
		  d.fy = d.y;
		}

		function dragged(d) {
		  d.fx = d3.event.x;
		  d.fy = d3.event.y;
		}

		function dragended(d) {
		  if (!d3.event.active) simulation.alphaTarget(0);
		  d.fx = null;
		  d.fy = null;
		}


	} //END create


	//REMOVE NETWORK
	self.delete = function() {
		$("#networkSvg").remove();
	} //END remove
	

}