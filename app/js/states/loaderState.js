function loaderState(){

	APP.dataset.loadData(function(){
		APP.stator.go('onboardingState', {encode: false})
	})
	
	return {
		enter: function(option){
			console.log('loaderState :: enter');

		},
		leave: function(option){
			console.log('loaderState :: leave')
			
		}
	}

}
