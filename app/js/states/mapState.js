function mapState(){

	var timeout

	return {
		url: "map",
		enter: function(option){
			console.log('mapState :: enter');
			APP.currentStateId = 2;
			APP.setState('map')
			APP.ui.updateViewFunction = APP.map.update;
			APP.permalink.parseUrlParameters(option.param);
			APP.ui.updateNavigation()

			if(!_.isNaN(+option.param.l)) APP.map.showLinks = +option.param.l
			else APP.map.showLinks = 0

			if(option.param.x){
				var t = {
					x: +option.param.x,
					y: +option.param.y,
					k: +option.param.k
				}
				APP.map.defaultPosition(t)
			}
			$('#map-container').css({opacity:1, "pointer-events":"auto"})
			APP.map.reset();
			APP.map.update();
			if( !APP.views.map.shown ) {
				console.log("first time on map!")
				APP.views.map.shown = true;
				setTimeout(function(){	
					APP.ui.openInfoPanel();
				}, 2000)
				if (window.isMobile) {
					timeout = setTimeout(function(){	
						APP.coachMarks.show()
						APP.coachMarks.place($("#filter-tab"))
					}, 8000)
				}
			}
			
		},
		leave: function(option){
			console.log('mapState :: leave');
			$('#map-container').css({opacity:0, "pointer-events":"none"})
			console.log(timeout)
			clearTimeout(timeout)
		},
		update: function(option){
			APP.permalink.parseUrlParameters(option.param);
		}
	}

}
