function networkState () {
	return {
		enter: function(option){
			console.log('networkState :: enter');
			APP.setState('network')
      $('#network-wrapper').css({opacity: 1, 'pointer-events': 'auto'})
			APP.network.restart()
			APP.ui.updateViewFunction = APP.network.update;
			APP.permalink.parseUrlParameters(option.param);
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
			$('#network-wrapper').css({opacity: 0, 'pointer-events': 'none'})
			APP.network.pause()
		},
		update: function(option){
			APP.permalink.parseUrlParameters(option.param);
		}
	}
}