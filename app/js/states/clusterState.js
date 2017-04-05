function clusterState(){

	APP.cluster = new ClusterView();

	return {
		enter: function(option){
			console.log('clusterState :: enter');
			APP.cluster.create();
			APP.setState('cluster')
			APP.ui.updateViewFunction = APP.cluster.update;
			APP.permalink.parseUrlParameters(option.param);
			if( !APP.views.cluster.shown ) {
				console.log("first time on cluster!")
				APP.views.cluster.shown = true;
				setTimeout(function(){	
					APP.ui.openInfoPanel();
				}, 1000)
				setTimeout(function(){	
					APP.coachMarks.show()
					APP.coachMarks.place($("#filter-tab"))
				}, 8000)
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