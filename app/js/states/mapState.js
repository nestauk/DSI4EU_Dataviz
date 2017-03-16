function mapState(){

	APP.map = new MapView();

	return {
		enter: function(option){
			console.log('mapState :: enter');
			APP.map.create();
			APP.ui.show();
			APP.setState('map')
			$('#main-view').fadeIn();
		},
		leave: function(option){
			console.log('mapState :: leave');

			APP.map.delete();
			
		}
	}

}