function Dataset(){
	self.data = [];
	self.load = loadData;

	// loads the .csv file and returns the data
	function loadData(path, callback){


		if(callback) callback(data)
		else return data;
	}

	// cleans up the data and adds additional fields to the items
	function prepareData(){

		return data;
	}

	function cleanData(){

	}

	function addProjectCountries(){

	}
}