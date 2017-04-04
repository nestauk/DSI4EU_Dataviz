function clusterState(){

	APP.cluster = new ClusterView();

	return {
		enter: function(option){
			$('#main-view').show();
			console.log('clusterState :: enter');
			APP.cluster.create();
			APP.setState('cluster')
			if( !APP.views.cluster.shown ) {
				console.log("first time on cluster!")
				APP.views.cluster.shown = true;
				setTimeout(function(){	
					APP.ui.openInfoPanel();
				}, 1000)
			}
		},
		leave: function(option){
			console.log('clusterState :: leave');

			APP.cluster.delete();
			
		}
	}

}