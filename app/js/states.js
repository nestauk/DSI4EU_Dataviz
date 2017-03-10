;(function (window, $, undefined) {

	'use strict'

	// if(window.location && window.location.hash.indexOf('#')>=0){
	// 	window.location.href="/"
	// }

	$(document).ready(function(){

		APP.stator = new StateMan();
		APP.stator.state({

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


