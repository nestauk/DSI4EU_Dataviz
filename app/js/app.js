;(function(window, $, undefined){

	window.APP = {}
	APP.dataset = new Dataset();	
	APP.currentState = 0;
	$(document).ready(function(){

	    var timeline = ["loaderState", "onboardingState", "mapState", "networkState", "clusterState", "shareState"];

	    APP.stator.go("loaderState", {encode: false})

	    APP.stator.on("moveForward", moveForward);
	    APP.stator.on("moveBackward", moveBackward);

	    function moveForward(){
	      APP.stator.direction = "up";
	      if(APP.currentState < timeline.length-1){
	        APP.stator.go(timeline[++APP.currentState], {encode: false});
	      }
	      console.log(APP.currentState);
	    }

	    function moveBackward(){
	      APP.stator.direction = "down";
	      if(APP.currentState > 0) {
	        APP.stator.go(timeline[--APP.currentState], {encode: false});
	      }
	      console.log(APP.currentState);
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

  })



})(window, jQuery)