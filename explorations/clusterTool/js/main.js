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

	var w = 200,
			h = 200;
	
	var mainNestArrayScale = d3.scaleSqrt()
		.domain([1, maxMainNestArray])
		.range([1, w/2-10]);

	var mainNestSvgs = d3.select("body").selectAll("svg")
		.data(sortedMainNestArray)
		.enter()
		.append("svg")
			.attr("width", w)
			.attr("height", h)

	var mainNestBubbles = mainNestSvgs
		.append("circle")
			.attr("cx", w/2)
			.attr("cy", h/2)
			.attr("r", function (d) {
				return mainNestArrayScale(d.values.length);
			})
			.attr("fill", "salmon")

	var mainNestCaptions = mainNestSvgs
		.append("text")
			.attr("x", w/2)
			.attr("y", h-30)
			.attr("fill", "black")
			.attr("font-size", ".65rem")
			.attr("text-anchor", "middle")
			.text(function (d) {
				if (mainNestField==="linked_organisation_ids"){
					return orgScale(d.key);
				} else return d.key;
			})

	var mainNestNumbers = mainNestSvgs
		.append("text")
			.attr("x", w/2)
			.attr("y", h/2+5)
			.attr("fill", "black")
			.attr("font-size", ".65rem")
			.attr("text-anchor", "middle")
			.text(function (d) {
				return d.values.length;
			})
	
}