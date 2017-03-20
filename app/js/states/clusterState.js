function clusterState(){

	APP.cluster = new ClusterView();

	return {
		enter: function(option){
			$('.view').hide()
			$('#main-view').show();
			console.log('clusterState :: enter');
			APP.cluster.create("countries", "focus");
			APP.setState('cluster')
		},
		leave: function(option){
			console.log('clusterState :: leave');

			APP.cluster.delete();
			
		}
	}

}