;(function(window, $, undefined){
	
	console.log('app');



	$(document).ready(function(){

    var timeline = ["loaderState", "onboardingState", "mapState", "networkState", "clusterState", "shareState"];
    var currentStep = 0;

    setTimeout(function(){
      stator.go("loaderState", {encode: false})
    })

    stator.on("moveForward", moveForward);
    stator.on("moveBackward", moveBackward);

    function moveForward(){
      window.stator.direction = "up";
      if(currentStep < timeline.length-1){
        stator.go(timeline[++currentStep], {encode: false});
      }
      console.log(currentStep);
    }

    function moveBackward(){
      window.stator.direction = "down";
      if(currentStep > 0) {
        stator.go(timeline[--currentStep], {encode: false});
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