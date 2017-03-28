function mapState(){

	APP.map = new MapView();

	return {
		enter: function(option){
			console.log('mapState :: enter');
			APP.setState('map')
			APP.map.create();
			APP.ui.show();
			APP.currentStateId = 2;
			$('#main-view').fadeIn();
		},
		leave: function(option){
			console.log('mapState :: leave');

			APP.map.delete();
			
		}
	}

}