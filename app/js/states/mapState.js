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
			if( !APP.views.map.shown ) {
				console.log("first time on map!")
				APP.views.map.shown = true;
				setTimeout(function(){	
					APP.ui.openInfoPanel();
				}, 1000)
				setTimeout(function(){	
					APP.coachMarks.show()
					APP.coachMarks.place($("#filter-tab"))
				}, 8000)
			}
			
		},
		leave: function(option){
			console.log('mapState :: leave');

			APP.map.delete();
			
		}
	}

}