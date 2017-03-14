function loaderState(){

	APP.dataset.loadData(function(){
		APP.stator.go('onboarding', {encode: false})
		APP.currentStateId = 1;
	})
	
	return {
		enter: function(option){
			console.log('loaderState :: enter');
		},
		leave: function(option){
			console.log('loaderState :: leave');			
		}
	}

}
