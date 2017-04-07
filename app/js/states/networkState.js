function networkState () {
	return {
		enter: function(option){
			console.log('networkState :: enter');
			APP.currentStateId = 3;
			APP.setState('network')
      $('#network-wrapper').css({opacity: 1, 'pointer-events': 'auto'})
			APP.ui.updateViewFunction = APP.network.update;
			APP.permalink.parseUrlParameters(option.param);
			APP.ui.updateNavigation()

			if(!_.isNaN(+option.param.l)) APP.network.showLinkedOnly = +option.param.l
			else APP.network.showLinkedOnly = 1

			APP.network.update()

			if(option.param.org || option.param.prj){
				var set = option.param.org ? APP.filter.orgs : APP.filter.prjs
				var node = _.find(set, {id: parseInt(option.param.org) || parseInt(option.param.prj)});
				console.log(node)
				setTimeout(function(){
					APP.network.focus(node)
				}, 1000)
			}

			if( !APP.views.network.shown){
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