function clusterState(){

	var timeout
	APP.cluster = new ClusterView();

	return {
		enter: function(option){
			console.log('clusterState :: enter');
			APP.cluster.create();
			APP.setState('cluster')
			APP.ui.updateViewFunction = APP.cluster.update;
			APP.permalink.parseUrlParameters(option.param);
			APP.ui.updateNavigation()
			if( !APP.views.cluster.shown ) {
				console.log("first time on cluster!")
				APP.views.cluster.shown = true;
				setTimeout(function(){	
					APP.ui.openInfoPanel();
					if (isMobile) {
						$(".cluster-wrapper").click( function (e) {
							e.stopPropagation()	
							APP.coachMarks.show()
							APP.coachMarks.place($("#filter-tab"))
						})
					}
				}, 1000)
			}
		},
		leave: function(option){
			console.log('clusterState :: leave');
			APP.cluster.delete();
			
		},
		update: function(option){
			APP.permalink.parseUrlParameters(option.param);
		}
	}

}