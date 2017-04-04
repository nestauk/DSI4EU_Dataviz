function clusterState(){

	APP.cluster = new ClusterView();

	return {
		enter: function(option){
			$('#main-view').show();
			console.log('clusterState :: enter');
			APP.cluster.create();
			APP.setState('cluster')
			var el = _.find(APP.viewShown, function (d) {	return d.name === APP.state	})
			if( !el.shown ) {
				console.log("first time on cluster!")
				el.shown = true;
			}
		},
		leave: function(option){
			console.log('clusterState :: leave');

			APP.cluster.delete();
			
		}
	}

}