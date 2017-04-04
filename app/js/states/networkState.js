function networkState(){

	APP.network = new NetworkView();

	return {
		enter: function(option){
			$('#main-view').show();
			console.log('networkState :: enter');
			APP.setState('network')
			APP.network.create();
			var el = _.find(APP.viewShown, function (d) {	return d.name === APP.state	})
			if( !el.shown ){
				console.log("first time on network!")
				setTimeout(function(){	
					el.shown = true;
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