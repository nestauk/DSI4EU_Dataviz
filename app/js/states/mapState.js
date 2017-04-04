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
			var el = _.find(APP.viewShown, function (d) {	return d.name === APP.state	})
			if( !el.shown ) {
				console.log("first time on map!")
				el.shown = true;
			}
			
		},
		leave: function(option){
			console.log('mapState :: leave');

			APP.map.delete();
			
		}
	}

}