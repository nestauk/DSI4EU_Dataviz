function loaderState(){

	return {
		enter: function(option){
			console.log('loaderState :: enter');

			APP.dataset.loadData(function(){
				APP.stator.go('onboardingState', {encode: false})
			})
		},
		leave: function(option){
			console.log('loaderState :: leave')
			
		}
	}

}
