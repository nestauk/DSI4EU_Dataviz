;(function(window, $, undefined){

	window.APP = {}
	APP.dataset = new Dataset();	

	$(document).ready(function(){

	    var timeline = ["loaderState", "onboardingState", "mapState", "networkState", "clusterState", "shareState"];
	    var currentStep = 0;

	    APP.stator.go("loaderState", {encode: false})

	    APP.stator.on("moveForward", moveForward);
	    APP.stator.on("moveBackward", moveBackward);

	    function moveForward(){
	      APP.stator.direction = "up";
	      if(currentStep < timeline.length-1){
	        APP.stator.go(timeline[++currentStep], {encode: false});
	      }
	      console.log(currentStep);
	    }

	    function moveBackward(){
	      APP.stator.direction = "down";
	      if(currentStep > 0) {
	        APP.stator.go(timeline[--currentStep], {encode: false});
	      }
	      console.log(currentStep);
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