function clusterState(){

	return {
		enter: function(option){
			console.log('clusterState :: enter')

		},
		leave: function(option){
			console.log('clusterState :: leave')
			
		}
	}

}