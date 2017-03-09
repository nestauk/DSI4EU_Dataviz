;(function (window, $, undefined) {

	'use strict'

	if(window.location && window.location.hash.indexOf('#')>=0){
		window.location.href="/"
	}

	$(document).ready(function(){

		window.stator = new StateMan();

		window.stator.state({
		  "stateone": new StateOne()
		}).on("notfound", function(){
		  this.go('stateone')
		}).start({html5:false});

	})


})(window, window.jQuery);


