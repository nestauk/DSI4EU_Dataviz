d3.queue()
  .defer(d3.json, '/data/organisations.json')
  .defer(d3.json, '/data/projects.json')
  .await(clusterView);


/* returns a list of all the field argument unique values */
function allValues(data, field) {
	var temp = [];
  data.forEach(function(d){
  	if (d[field].length > 1) {
  		d[field].forEach(function(e){
  			temp.push(e);
  		});
  	}
  })
  var uniqueTemp = _.uniq(temp);
  //console.log(uniqueTemp);
  return uniqueTemp;
}


function clusterView(error, orgData, prjData) {
	if (error) throw error;
	//console.log(prjData);
	//
  var mainNestField = "countries"; //property by which we are going to cluster
  var secNestField = "focus"; //property by which we are going to cluster
  
  var orgIds = [];
			orgNames = [];
			orgCountries = [];
  orgData.forEach(function (d) {
  	orgIds.push(d.organisation_id);
  	orgNames.push(d.organisation_name);
  	orgCountries.push(d.country);
  });

	//associates ORG countries to ORG ids
	var countryScale = d3.scaleOrdinal()
		.domain(orgIds)
		.range(orgCountries);

	//associates ORG names to ORG ids
	var orgScale = d3.scaleOrdinal()
		.domain(orgIds)
		.range(orgNames);

  prjData.forEach(function (d) {
  	d.countries = [];
  	d.linked_organisation_ids.forEach(function (e) {
  		if (countryScale(e)!=="") d.countries.push(countryScale(e));
  	});
  });

  prjData.forEach(function (d) {
  	d.countries = _.uniq(d.countries);
  });

  //console.log(prjData);
  
  var valuesMainArray = allValues(prjData, mainNestField); //returns mainNestField unique values

  var mainNestArray = [];
  valuesMainArray.forEach(function (d) {
  	mainNestArray.push({
  		key: d,
  		values: []
  	});
  });
	
	mainNestArray.forEach(function (f) {
		//selectedPrj = Prj with f.key value present in mainNestField array
		var selectedPrj = prjData.filter(function (d) {
			return d[mainNestField].includes(f.key);
		})
		f.values = (selectedPrj);
	})

	var sortedMainNestArray = mainNestArray.sort(function (a,b) { return b.values.length-a.values.length; });
	var maxMainNestArray = sortedMainNestArray[0].values.length;
	//console.log(maxMainNestArray);
	//console.log(sortedMainNestArray);



	var valuesSecArray = allValues(prjData, secNestField); //returns mainNestField unique values
	//console.log(valuesSecArray)

	//creation of a double nested data structure: main nesting populated with sortedMainNestArray keys and secondary nesting with empty values
	var secNestArray = [];
	sortedMainNestArray.forEach(function (f) {
		secNestArray.push({
  		key: f.key,
  		values: []
  	});
	});
	secNestArray.forEach(function (f) {
		valuesSecArray.forEach(function (d) {
			f.values.push({
				key: d,
  			values: []
			})
		})
	})

 //  secNestArray.forEach(function (f) {
 //  	f.values.forEach(function (e) {
 //  		//console.log(e)
	// 		var selectedSec = sortedMainNestArray.filter(function (d) {
	// 			return _.some(d.values, function (c) {
	// 				return c[secNestField].includes(e.key);
	// 			}) && f.key===d.key;
	// 		})
	// 		//console.log(f.key, e.key, selectedSec)
	// 		if (!_.isEmpty(selectedSec)) {
	// 			e.values = selectedSec[0].values;
	// 		}
 //  	})
	// })
	



	//console.log(prjData);

	function filterPrj(field1Name, field1, field2Name, field2) {
		var filteredPrjData = prjData.filter(function (d) {
			return d[field1Name].includes(field1) && d[field2Name].includes(field2);
		})
		return filteredPrjData;
	}

	secNestArray.forEach(function (f) {
  	f.values.forEach(function (e) {
  		var doubleNestPrj = filterPrj(mainNestField, f.key, secNestField, e.key);
			//console.log(f.key, e.key, doubleNestPrj);
			e.values = doubleNestPrj;
  	})
	})

	//sort by number of prj per secNest field
	secNestArray.forEach(function (f) {
		f.values.sort(function (a,b) { return b.values.length-a.values.length; });
	})

	//console.log(secNestArray);
	
	var maxSecNestArray = d3.max(secNestArray, function (d) {
		return d.values[0].values.length;
	});

	//console.log(maxSecNestArray);

	//creo una struttura dati adatta al circle packing
	var packData = [];
	secNestArray.forEach(function (f) {
		var temp = {};
		temp.name = f.key;
		temp.children = [];
		f.values.forEach(function (d) {
			temp.children.push({
				"name": d.key,
				"size": d.values.length
			})
		})
		packData.push(temp);
	})

	console.log(packData)

	var w = 200,
			h = 200;

	format = d3.format(",d");
	
	var secNestArrayScale = d3.scaleSqrt()
		.domain([1, maxSecNestArray])
		.range([1, w/2-10]);

	var pack = d3.pack()
    .size([w - 4, h - 4]);

	var secNestSvgs = d3.select("body").selectAll("svg")
		.data(packData)
		.enter()
		.append("svg")
			.attr("class", function (d, i) {
				return "svg"+i;
			})
			.attr("width", w)
			.attr("height", h)
			.each(multiple)

  // var g = d3.select("body").append("svg")
  // 	.attr("width", w)
		// .attr("height", h)
		// 	.append("g").attr("transform", "translate(2,2)")

	function multiple(e, i) {
		console.log(e)
		console.log(i)

		var g = d3.select(".svg"+i).append("g")
				.attr("transform", "translate(2,2)");

	  var root = d3.hierarchy(packData[i])
	    .sum(function(d) { return d.size; })
	    .sort(function(a, b) { return b.value - a.value; });

	  var node = g.selectAll(".node")
	    .data(pack(root).descendants())
	    .enter().append("g")
	      .attr("class", function(d) { return d.children ? "node" : "leaf node"; })
	      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

	  node.append("circle")
	    .attr("r", function(d) { return d.r; })

	  node.append("title")
	    .text(function(d) { return d.data.name + "\n" + format(d.value); });

	  node.filter(function(d) { return !d.children; }).append("text")
	    .attr("dy", "0.3em")
	    .text(function(d) { return d.data.name.substring(0, d.r / 3); });
		
	}




	
}