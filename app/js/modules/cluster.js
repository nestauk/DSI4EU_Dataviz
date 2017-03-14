function ClusterView() {
	var self = this;

	//CREATE CLUSTER
	self.create = function(_mainNestField, _secNestField) {
		
		var width = $("#main-view").width(),
				height = $("#main-view").width(),
				clusterOffset = width/20;

		var orgData = _.cloneDeep(APP.dataset.orgs);
		var prjData = _.cloneDeep(APP.dataset.prjs);

		d3.selectAll(".clusterSvg").remove();
		
	  var mainNestField = _mainNestField; //property by which we are going to cluster
	  var secNestField = _secNestField; //property by which we are going to cluster
		
		//cleanDataset(prjData, secNestField, 5);
	  
	  var orgIds = [];
				orgNames = [];
				orgCountries = [];

	  orgData.forEach(function (d) {
	  	orgIds.push(d.id);
	  	orgNames.push(d.name);
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
		

		/* *** STATISTICS *** */
		//Total max value of the secNest parameter count
		var maxSecNestArray = d3.max(secNestArray, function (d) { 
			return d.values[0].values.length;
		});
		//console.log("maxSecNestArray: "+maxSecNestArray);

		//Array of mainNest groups with the sum of secNest counts
		var sumSecNestArray = [];
		secNestArray.forEach(function (f, i) {
			var mainNestSum = d3.sum(f.values, function (d) {
				return d.values.length;
			});
			sumSecNestArray.push({
				group: f.key,
				sum: mainNestSum
			});
		});
		//console.log("sumSecNestArray: ", sumSecNestArray);

		//Max value of the sum of secNest parameter counts of the mainNest parameter groups
		var maxSumSecNest = d3.max(secNestArray, function (f, i) { 
			var mainNestSum = d3.sum(f.values, function (d) {
				return d.values.length;
			});
			//console.log(i, mainNestSum)
			return mainNestSum;
		});
		//console.log("maxSumSecNest: "+maxSumSecNest);
		/* *** end STATISTICS *** */


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

		var svgWidth = width/2 - clusterOffset,
				svgHeight = width/2 - clusterOffset,
				padding = 4;

		format = d3.format(",d");

		var focusColorScale = d3.scaleOrdinal()
			.domain(valuesSecArray)
			.range(["#f1d569", "#ffad69", "#ff6769", "#f169c4"]);

		var otherColorScale = d3.scaleOrdinal()
			.domain(valuesSecArray)
			.range(d3.schemeCategory20);

		var secNestSvgs = d3.select("#main-view").selectAll("svg")
			.data(packData)
			.enter()
			.append("svg")
				.attr("class", function (d, i) {
					return "clusterSvg clusterSvg"+i;
				})
				.attr("width", svgWidth)
				.attr("height", svgHeight)
				.each(multiple);
		
		//Draws one circle pack per svg
		function multiple(e, i) {
			//console.log(e, i)
			
			//adjusts the scale depending on the total counts value of the different mainNest fields
			var scaleSvg = d3.scaleLinear()
				.domain([0, 1000])
				.range([4, 6]);
			
			//var scaleFactor = 4; //to be used when scaleSvg is not used in clusterScale
			var clusterScale = d3.scaleLinear()
				.domain([0, maxSecNestArray])
				.range([0, svgWidth/scaleSvg(maxSumSecNest)]);
		
			var pack = d3.pack()
	    	.size([svgWidth - padding, svgHeight - padding])
	    	.radius(function(d){ return clusterScale(d.value); });

		  var root = d3.hierarchy(packData[i])
		    .sum(function(d) { return d.size; })
		    .sort(function(a, b) { return b.value - a.value; });
			
			var g = d3.select(".clusterSvg"+i).append("g")
					.attr("transform", "translate(" + padding/2 + "," + padding/2 + ")");

		  var node = g.selectAll(".node")
		    .data(pack(root).descendants())
		    .enter().append("g")
		      .attr("class", function(d) { return d.children ? "node" : "leaf node"; })
		      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

		  node.append("circle")
		  	.style("fill", function (d, j) {
		  		if (j!=0) {	
		  			if (secNestField==="focus"){
		  				return focusColorScale(d.data.name);
		  			}	else return otherColorScale(d.data.name);
		  		}
		  	})
		    .attr("r", function(d, j) { return d.r; })

		  var secNestCaptions = g.append("text")
				.attr("x", svgWidth/2)
				.attr("y", svgHeight-30)
				.attr("fill", "black")
				.attr("font-size", "1rem")
				.attr("text-anchor", "middle")
				.text(function () {
					if (mainNestField==="linked_organisation_ids"){
						return orgScale(e.name);
					} else return e.name;
				})

		  node.append("title")
		    .text(function(d) { 
		    	if (secNestField==="linked_organisation_ids"){
						return orgScale(d.data.name) + "\n" + format(d.value);
					} else return d.data.name + "\n" + format(d.value);
		    });

		  // node.filter(function(d) { return !d.children; }).append("text")
		  //   .attr("dy", "0.3em")
		  //   .attr("class", "smallLabel")
		  //   .text(function(d) { return d.value; });
		}


	} //END create


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


	//REMOVE NETWORK
	self.delete = function() {
		$(".clusterSvg").remove();
	} //END remove
	

}