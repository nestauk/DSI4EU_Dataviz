var svg = d3.select("svg"),
  width = +svg.attr("width"),
  height = +svg.attr("height");

var color = d3.scaleOrdinal(["steelblue", "salmon"]);

var simulation = d3.forceSimulation()
  .force("link", d3.forceLink().id(function(d) { return d.id; }).strength(2))
  //.force("charge", d3.forceManyBody())
  .force("charge", d3.forceManyBody().strength(-150).distanceMax(100))
  .force("center", d3.forceCenter(width / 2, height / 2));

d3.queue()
  .defer(d3.json, '/data/organisations.json')
  .defer(d3.json, '/data/projects.json')
  .await(dataprocess);
  //.await(findSharedPrjs);

function findSharedPrjs(error, orgData, prjData) {
	if (error) throw error;
	console.log(prjData)
	//findNetworks(orgData, "linked_project_ids");
	findNetworks(prjData, "linked_organisation_ids");
}

// function findNetworks(data, field) {
// 	var list = [];
// 	var connectedOrgs = [];
//   data.forEach(function(d){
//   	d[field].forEach(function(e){
//   		var match = list.filter(function(f){ return f.prj === e });
//   		if ( _.isEmpty(match) ) {
//   			list.push({
//   				org: "org"+d.organisation_id,
//   				prj: e,
//   				count: 1
//   			});
//   		} else {
//   			var index = _.findKey(list, function(o) { return o.prj===e; });
//   			list[index].count++;
//   		}
//   	})
//   })
//   list.sort(function(a,b) {
// 	  return b.count - a.count;
// 	});
//   filteredList = list.filter(function (d) { return d.count>1; });
//   filteredList.forEach(function (d) {
//   	connectedOrgs.push(d.org);
//   });
//   console.log(connectedOrgs);
//   return connectedOrgs;
// }


function findNetworks(data, field) {
	var list = [];
  data.forEach(function(d){
  	if (d[field].length > 1) {
  		d[field].forEach(function(e){
  			list.push("org"+e);
  		});
  	}
  })
  var cleanList = _.uniq(list);
  console.log(cleanList);
  return cleanList;
}


function dataprocess(error, orgData, prjData) {
	if (error) throw error;
	//console.log(orgData);
	//console.log(prjData);
	var org = [];
	var prj = [];

	orgData.forEach(function (d) {
		var temp = {};
		var prjArray = d.linked_project_ids.map(function (e) {
			return "prj"+e;
		});
		temp.type = 0;
		temp.id = "org"+d.organisation_id;
		temp.prjlinks = prjArray;
		temp.country = d.country;
		temp.name = d.organisation_name;
		org.push(temp);
	})
	//console.log(org);
	prjData.forEach(function (d) {
		var temp = {};
		var orgArray = d.linked_organisation_ids.map(function (e) {
			return "org"+e;
		});
		temp.type = 1;
		temp.id = "prj"+d.project_id;
		temp.orglinks = orgArray;
		temp.name = d.project_name;
		prj.push(temp);
	})
	//console.log(prj);
	
	var selectedOrgs = findNetworks(prjData, "linked_organisation_ids");
	
	var filteredOrg = org.filter(function (d) {
		return d.country!="";
		//return d.country==="United Kingdom";
		return selectedOrgs.includes(d.id);
	});
	var filteredPrj = prj.filter(function (d) {
		return d.id!="";
		//return !_.isEmpty(d.orglinks) && d.orglinks.length > 1;
	});

	var nodes = filteredOrg.concat(filteredPrj);
	console.log(nodes);

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