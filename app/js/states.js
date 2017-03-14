;(function (window, $, undefined) {

	'use strict'

	// if(window.location && window.location.hash.indexOf('#')>=0){
	// 	window.location.href="/"
	// }

	$(document).ready(function(){

		APP.stator = new StateMan();
		APP.stator.state({

		  "loader": new loaderState(),
		  "onboarding": new onboardingState(),
		  "map": new mapState(),
		  "network": new networkState(),
		  "cluster": new clusterState(),
		  "share": new shareState()

		}).on("notfound", function(){
		  this.go("loader")
		}).start({html5:false});

	})


})(window, window.jQuery);


