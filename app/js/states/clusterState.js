function clusterState(){

	var timeout
	APP.cluster = new ClusterView();

	return {
		enter: function(option){
			console.log('clusterState :: enter');
			APP.currentStateId = 4;
			APP.setState('cluster')
			APP.ui.updateViewFunction = APP.cluster.update;
			APP.permalink.parseUrlParameters(option.param);
			
			if(_.isString(option.param.g)) APP.cluster.cluster_field = option.param.g
			if(_.isString(option.param.s)) APP.cluster.subdivide_field = option.param.s

			APP.cluster.create();
			APP.ui.updateNavigation()
			if( !APP.storage.get('visitedViews') || !APP.storage.get('visitedViews').cluster || APP.views.cluster.tobeshow ) {
				console.log("first time on cluster!")
				var visitedViews = _.defaults(APP.storage.get('visitedViews'), {cluster: true})
				APP.storage.set('visitedViews', visitedViews)
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
