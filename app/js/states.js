;(function (window, $, undefined) {

	'use strict'

	// debug only
	if(window.location && window.location.hash.indexOf('#')>=0){
		window.location.href="/"
	}

	$(document).ready(function(){

		APP.stator = new StateMan();

		var onboarding = new onboardingState()

		APP.stator.state({

		  "loader": new loaderState(),
		  "onboarding": onboarding,
		  "onboarding.one": onboarding.one,
		  "onboarding.two": onboarding.two,
		  "onboarding.three": onboarding.three,
		  "onboarding.four": onboarding.four,
		  "onboarding.five": onboarding.five,
		  "map": new mapState(),
		  "network": new networkState(),
		  "cluster": new clusterState(),
		  "share": new shareState()

		}).on("notfound", function(){
		  this.go("loader")
		}).start({html5:false});

	})


})(window, window.jQuery);


