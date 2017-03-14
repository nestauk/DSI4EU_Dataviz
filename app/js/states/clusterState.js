function clusterState(){

	APP.cluster = new ClusterView();

	return {
		enter: function(option){
			console.log('clusterState :: enter');
			APP.cluster.create("countries", "focus");
			APP.setState('cluster')
		},
		leave: function(option){
			console.log('clusterState :: leave');

			APP.network.delete();
			
		}
	}

}