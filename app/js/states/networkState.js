function networkState(){

	APP.network = new NetworkView();

	return {
		enter: function(option){
			$('#main-view').show();
			console.log('networkState :: enter');
			APP.setState('network')
			APP.network.create();
			if(!APP.network.statsShown){
				setTimeout(function(){	
					APP.network.statsShown = true;
					APP.ui.openNetworkStats();
				}, 1000)
			}
		},
		leave: function(option){
			console.log('networkState :: leave');

			APP.network.delete();
			
		}
	}

}