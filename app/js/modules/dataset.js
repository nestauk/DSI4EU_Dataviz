function Dataset(){
	var self = this;
	self.data = [];
	self.loadData = loadData;

	const organisations_path = 'data/organisations.json';
	const projects_path = 'data/projects.json';

	// loads the .csv file and returns the data
	function loadData(callback){
		d3.queue()
		  .defer(d3.json, organisations_path)
		  .defer(d3.json, projects_path)
		  .await(function(error, orgData, prjData){
		  	if(error) {
		  		console.log(error);
		  		return;
		  	} 
		  	prepareData({orgs: orgData, prjs: prjData});
		  	if(callback) callback();
		  });


	}

	// cleans up the data and adds additional fields to the items
	function prepareData(data){
		self.orgs = data.orgs;
		self.prjs = data.prjs;
	}

	function cleanData(){

	}

	function addProjectCountries(){

	}
}