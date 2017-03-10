function loaderState(){

	return {
		enter: function(option){
			console.log('loaderState :: enter');

			d3.queue()
			  .defer(d3.json, 'data/organisations.json')
			  .defer(d3.json, 'data/projects.json')
			  .await(handleData);

		},
		leave: function(option){
			console.log('loaderState :: leave')
			
		}
	}



	function handleData(error, orgData, prjData) {

		console.log("Organisations: ", orgData);
		console.log("Projects: ", prjData);
	}

}
