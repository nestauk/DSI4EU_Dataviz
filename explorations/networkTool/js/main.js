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

// /* for testing */
// function findSharedPrjs(error, orgData, prjData) {
// 	if (error) throw error;
// 	console.log(prjData)
// 	findConnectedOrg(prjData, "linked_organisation_ids");
// }

/* returns a list of ORGs with shared PRJs */
function findConnectedOrg(data, field) {
	var orgList = [];
  data.forEach(function(d){
  	if (d[field].length > 1) {
  		d[field].forEach(function(e){
  			orgList.push("org"+e);
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
		return ConnectedOrgArray.includes("org"+d.organisation_id);
	});
  filteredData.forEach(function(d){
		d[field].forEach(function(e){
			prjList.push("prj"+e);
  	});
  });
  var cleanPrjList = _.uniq(prjList);
  return cleanPrjList;
}


function dataprocess(error, orgData, prjData) {
	if (error) throw error;
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
	
	var selectedOrgs = findConnectedOrg(prjData, "linked_organisation_ids"); //ORGs with shared PRJs

	var selectedPrjs = findConnectedPrj(orgData, selectedOrgs, "linked_project_ids");
	
	var filteredOrg = org.filter(function (d) {
		//return d.country!="";
		//return d.country==="United Kingdom";
		return selectedOrgs.includes(d.id);
	});
	var filteredPrj = prj.filter(function (d) {
		//return d.id!="";
		return selectedPrjs.includes(d.id);
	});

	/* builds up the nodes (ORGs and PRJs) */
	var nodes = filteredOrg.concat(filteredPrj);

	var links = [];

	/* builds up the links (connections between nodes) */
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