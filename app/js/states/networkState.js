function networkState(){

	APP.network = new NetworkView();

	return {
		enter: function(option){
			$('#main-view').show();
			console.log('networkState :: enter');
			APP.setState('network')
			APP.network.create();
			setTimeout(function(){	
				APP.ui.openNetworkStats();
			}, 1000)
		},
		leave: function(option){
			console.log('networkState :: leave');

			APP.network.delete();
			
		}
	}

}