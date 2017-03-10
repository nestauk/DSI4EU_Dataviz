;(function (window, $, undefined) {

	'use strict'

	// if(window.location && window.location.hash.indexOf('#')>=0){
	// 	window.location.href="/"
	// }

	$(document).ready(function(){

		window.stator = new StateMan();

		window.stator.state({

		  "loaderState": new loaderState(),
		  "onboardingState": new onboardingState(),
		  "mapState": new mapState(),
		  "networkState": new networkState(),
		  "clusterState": new clusterState(),
		  "shareState": new shareState()

		}).on("notfound", function(){
		  this.go("loaderState")
		}).start({html5:false});

	})


})(window, window.jQuery);


