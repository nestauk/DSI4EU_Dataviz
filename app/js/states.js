function States() {
	var self = this;
	var stator = new StateMan();
	stator.navigateDefault = navigateDefault

	var onboarding = new onboardingState()

	stator.state({

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

		})
		// .on("notfound", function(options) {
		// 	console.log('NOTFOUND', options, window.location)
		// 	this.go("map")
		// })
		// .start({
		// 	html5: false
		// });
		// 
		function navigateDefault(){
			$('#main-view').fadeIn();
			APP.ui.show();
			APP.stator.go(APP.defaultLandingState.name, {param: APP.defaultLandingState.param})
		}
		return stator
}