function networkState(){

	APP.network = new NetworkView();

	return {
		enter: function(option){
			$('#main-view').show();
			console.log('networkState :: enter');
			APP.setState('network')
			APP.network.create();

		},
		leave: function(option){
			console.log('networkState :: leave');

			APP.network.delete();
			
		}
	}

}