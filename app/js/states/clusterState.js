function clusterState(){

	var timeout
	APP.cluster = new ClusterView();

	return {
		enter: function(option){
			console.log('clusterState :: enter');
			APP.setState('cluster')
			APP.ui.updateViewFunction = APP.cluster.update;
			APP.permalink.parseUrlParameters(option.param);
			
			if(_.isString(option.param.g)) APP.cluster.cluster_field = option.param.g
			if(_.isString(option.param.s)) APP.cluster.subdivide_field = option.param.s

			APP.cluster.create();
			APP.ui.updateNavigation()
			if( !APP.views.cluster.shown ) {
				console.log("first time on cluster!")
				APP.views.cluster.shown = true;
				setTimeout(function(){	
					APP.ui.openInfoPanel();
					if (window.isMobile) {
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