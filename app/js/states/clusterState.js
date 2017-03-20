function clusterState(){

	APP.cluster = new ClusterView();

	return {
		enter: function(option){
			$('#main-view').show();
			console.log('clusterState :: enter');
			APP.cluster.create("countries", "support_tags");
			APP.setState('cluster')
		},
		leave: function(option){
			console.log('clusterState :: leave');

			APP.cluster.delete();
			
		}
	}

}