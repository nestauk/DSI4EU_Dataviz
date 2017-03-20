function onboardingState(){

	return {
		enter: function(option){
			console.log('onboardingState :: enter')
			$('#onboarding-skip').click(function(){
				APP.moveForward()
			})
		},
		leave: function(option){
			console.log('onboardingState :: leave')
			$('#onboarding-view').fadeOut();

			//filter tab open in desktop enivronment
			if (!window.isMobile) {
				APP.ui.openFilterTab();
			}

		}
	}

}