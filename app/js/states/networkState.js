function networkState(){

	APP.network = new NetworkView();

	return {
		enter: function(option){
			console.log('networkState :: enter');

			APP.network.create();

		},
		leave: function(option){
			console.log('networkState :: leave');

			APP.network.delete();
			
		}
	}

}