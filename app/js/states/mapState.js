function mapState(){

	APP.map = new MapView();

	return {
		enter: function(option){
			console.log('mapState :: enter');

			APP.map.create();

		},
		leave: function(option){
			console.log('mapState :: leave');

			APP.map.delete();
			
		}
	}

}