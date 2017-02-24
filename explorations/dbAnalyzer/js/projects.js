function projects() {

	var prjFields = ["who_we_help_tags", "support_tags", "focus", "technology"];

	d3.select("#title").html("Projects");
	d3.selectAll("p").remove();

	var selectField = d3.select("#selectField").selectAll('option')
    .data(prjFields)

  selectField
      .attr("value", function(d) {
          return d;
      })
      .text(function(d) { 
          return d;
      });

  var newselectField = selectField
    .enter()
    .append("option")
      .attr("value", function(d) {
          return d;
      })
      .text(function(d) { 
          return d;
      });

  selectField.exit().remove();

  //seleziono il primo item del menu a tendina prj
  $("#selectField").val(prjFields[0]);

	

	d3.json("/data/projects.json", function(data) {
		  //console.table(data);
			
		  listCountField(prjFields[0]);


		  // *** Lista i valori possibili per i campi *** //
		  function listField(field) {
		  	var list = [];
			  data.forEach(function(d){
			  	d[field].forEach(function(e){
			  		if (!_.includes(list, e)) {
			  			list.push(e);
			  		}
			  	})
			  })
			  list.sort();
			  console.log(list)
			  console.log(list.length)
		  }


		  // *** Lista i valori possibili per i campi e ne conteggia il numero di occorrenze *** //
		  function listCountField(field) {
		  	var list = [];
			  data.forEach(function(d){
			  	d[field].forEach(function(e){
			  		var match = list.filter(function(f){ return f.name === e });
			  		if ( _.isEmpty(match) ) {
			  			list.push({
			  				name: e,
			  				count: 1
			  			});
			  		} else {
			  			var index = _.findKey(list, function(o) { return o.name===e; });
			  			list[index].count++;
			  		}
			  	})
			  })
			  list.sort(function(a,b) {
				  return b.count - a.count;
				});
			  d3.selectAll("p").remove();
			  list.forEach(function (d) {
			  	d3.select("#paragraphContainer").append("p")
						.html(d.name+": "+d.count);
			  })
		  }
		  

		  // function countField(field) {
		  // 	var fieldCount = d3.nest()
				//   .key(function(d) { return d[field]; })
				//   .rollup(function(v) { return v.length; })
				//   .entries(data);
				// fieldCount.forEach(function (d) {
				// 	console.log(d.key+", "+d.values)
				// })
		  // }
		  

		  // select fields listener
		  d3.select("#selectField").on("change", function () {
				var selectedIndex = d3.select(this).property("selectedIndex");
				listCountField(prjFields[selectedIndex]);
			})
		  
	});

}