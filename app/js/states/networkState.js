function networkState(){

	APP.network = new NetworkView();

	return {
		enter: function(option){
			$('#main-view').show();
			console.log('networkState :: enter');
			APP.setState('network')
			APP.network.create();
			if( !APP.views.network.shown ){
				console.log("first time on network!")
				APP.views.network.shown = true;
				setTimeout(function(){	
					APP.ui.openInfoPanel();
				}, 1000)
			}
		},
		leave: function(option){
			console.log('networkState :: leave');

			APP.network.delete();
			
		}
	}

}