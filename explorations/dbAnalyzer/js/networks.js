$( document ).ready(function() {

	d3.json("/data/organisations.json", function(data) {
		  //console.log(data);
		  
		  listCountField("linked_project_ids");

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
				var sharedProjects = list.filter(function(f){ return f.count > 1 });
			  d3.selectAll("p").remove();
			  sharedProjects.forEach(function (d) {
			  	d3.select("#paragraphContainer").append("p")
						.html("Project ID "+d.name+": "+d.count);
			  })
			  var counts = d3.nest()
				  .key(function(d) { return d.count; })
				  .rollup(function(v) { return v.length; })
				  .entries(sharedProjects);

				// counts.forEach(function (d) {
			 //  	d3.select("#paragraphContainer").append("p")
				// 		.html("Number of projects shared by "+d.key+" organisations: "+d.value);
			 //  })

		  }

	});

});