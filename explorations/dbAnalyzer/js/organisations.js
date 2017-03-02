function organisations() {

	var orgFields = ["tags", "networkTags"];

	d3.select("#title").html("Organisations");
	d3.selectAll("p").remove();

	var selectField = d3.select("#selectField").selectAll('option')
    .data(orgFields)

  selectField
      .attr('value', function(d) {
          return d;
      })
      .text(function(d) { 
          return d;
      });

	var newselectField = selectField
    .enter()
    .append('option')
      .attr('value', function(d) {
          return d;
      })
      .text(function(d) { 
          return d;
      });

  selectField.exit().remove();

  ////seleziono il primo item del menu a tendina org
  $("#selectField").val(orgFields[0]);



	d3.json("data/organisations.json", function(data) {
		  //console.log(data);
		  
		  listCountField(orgFields[0]);

		  // data.forEach(function(d){
		  // 	console.log(d)
		  // 	d.tags.forEach(function(e){
			 //  	if( $.inArray(e, d.tags) != -1){
				// 		console.log('value is Array!');
				// 	} else {
				// 		console.log('Not an array');
				// 	}
			 //  	d.tags.forEach(function(e) {
			 //  		console.log(e)
			 //  		d["tag_"+e] = 1;
			 //  	})
			 //  })	
		  // })

		  //var filtered = data.filter(function(d) { return d.tags.length != 0; });
		  //var filtered = data.filter(function(d) { return d.focus.length != 0; });
		  //var filtered = data.filter(function(d) { return d.project_id == 800; });

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

		  //listField(prj3);

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


		  // select fields listener
		  d3.select("#selectField").on("change", function () {
				var selectedIndex = d3.select(this).property("selectedIndex");
				listCountField(orgFields[selectedIndex]);
			})

	});

}