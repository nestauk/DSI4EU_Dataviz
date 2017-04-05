function mapState(){

	return {
		url: "map",
		enter: function(option){
			console.log('mapState :: enter');
			APP.setState('map')
			APP.permalink.parseUrlParameters(option.param);
			if(option.param.x){
				var t = {
					x: +option.param.x,
					y: +option.param.y,
					k: +option.param.k
				}
				APP.map.defaultPosition(t)
			}
			$('#map-container').css({opacity:1, "pointer-events":"auto"})
			APP.currentStateId = 2;
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
			$('#map-container').css({opacity:0, "pointer-events":"none"})
		},
		update: function(option){
			APP.permalink.parseUrlParameters(option.param);
		}
	}

}