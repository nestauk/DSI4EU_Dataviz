;(function(window, $, undefined){

	window.APP = {}
	APP.dataset = new Dataset();	
	APP.currentStateId = 0;
	$(document).ready(function(){
		APP.setState = setState;
		APP.moveForward = moveForward;
		APP.moveBackward = moveBackward;

		APP.ui = new UserInterface();
		APP.ui.updateNavigation();

	    var timeline = ["loader", "onboarding", "map", "network", "cluster", "share"];

	    APP.stator.go("loader", {encode: false})

	    APP.stator.on("moveForward", moveForward);
	    APP.stator.on("moveBackward", moveBackward);

	    function moveForward(){
	      APP.stator.direction = "up";
	      if(APP.currentStateId < timeline.length-1){
	        APP.stator.go(timeline[++APP.currentStateId], {encode: false});
	      }
	      console.log(APP.currentStateId);
	      APP.ui.updateNavigation()
	    }

	    function moveBackward(){
	      APP.stator.direction = "down";
	      if(APP.currentStateId > 0) {
	        APP.stator.go(timeline[--APP.currentStateId], {encode: false});
	      }
	      console.log(APP.currentStateId);
	      APP.ui.updateNavigation()
	    }


	    // listeners
	    window.addEventListener("keydown", doKeyDown, true);

	    function doKeyDown(e){
	      if(e.key === "ArrowRight") {
	        moveForward();
	      }
	      if(e.key === "ArrowLeft") {
	        moveBackward();
	      }
	    }

	    function setState(state){
	    	$('body').removeClass(APP.state)
	    	APP.state = state;
	    	$('body').addClass(APP.state)
	    }

  })



})(window, jQuery)