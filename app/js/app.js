;(function(window, $, undefined) {

	window.APP = {}
	APP.currentStateId = 0;
	APP.defaultLandingState = {
		name: 'map',
		param: {}
	}
	APP.filter_fields = ["support_tags", "technology", "networkTags", "organisation_type"];

	$(document).ready(function() {
		console.log('ready')
		APP.dataset = new Dataset();
		APP.loader = new Loader();

		APP.setState = setState;
		APP.getColorScale = getColorScale;
		APP.filter = new Filter();
		APP.infoPanel = new InfoPanel();
		APP.orgList = new OrgList();
		APP.orgPanel = new OrgPanel();
		APP.networkList = new NetworkList();
		APP.networkPanel = new NetworkPanel();
		APP.clusterPanel = new ClusterPanel();
		APP.search = new Search();
		APP.share = new Share();
		APP.ui = new UserInterface();
		APP.coachMarks = new CoachMarks();
		APP.permalink = new Permalink();
		APP.storage = new Storage();

		APP.loader.start();

		APP.views = {
			map: { shown: false },
			network: { shown: false },
			cluster: { shown: false }
		}

		APP.stator = new States();

		APP.dataset.loadData(function() {
			APP.filter.init();

			APP.map = new MapView()
    	APP.map.create()

    	APP.network = new NetworkView()
    	APP.network.create()
    	APP.network.pause()
    	$('#network-wrapper').css({opacity: 0, 'pointer-events': 'none'})

			APP.loader.stop();
			APP.currentStateId = 1;
			APP.ui.init();
			createColorScales();
			APP.stator.start({
				html5: false
			})

			if (APP.stator.current.name && !_.includes(APP.stator.current.name, 'onboarding')) {
				APP.defaultLandingState.name = APP.stator.current.name;
				APP.defaultLandingState.param = APP.stator.param;
			}
			if (window.localStorage.getItem('visited')) {
				APP.stator.navigateDefault();
			} else {
				APP.stator.go('onboarding.one')
			}
		})

		function setState(state) {
			$('body').removeClass(APP.state)
			APP.state = state;
			$('body').addClass(APP.state)
		}

		function getColorScale(field) {
			switch (field) {
				case ("focus"):
					return APP.focusColorScale
					break
				case ("support_tags"):
					return APP.supportColorScale
					break
				case ("technology"):
					return APP.techColorScale
					break
			}
		}

		function createColorScales() {
			APP.focusColorScale = d3.scaleOrdinal()
				.domain(APP.dataset.fields["focus"].map(function(d) {
					return d.name
				}))
				.range(["#f28244", "#00a9c2", "#e36556", "#b164a5"]);

			APP.supportColorScale = d3.scaleOrdinal()
				.domain(APP.dataset.fields["support_tags"].map(function(d) {
					return d.name
				}))
				.range(["#f28244", "#f7c589", "#00a9c2", "#80d4e1", "#e36556", "#f3b4b9", "#b164a5", "#dbb1d2", "#76bd64", "#c6e293"]);

			APP.techColorScale = d3.scaleOrdinal()
				.domain(APP.dataset.fields["technology"].map(function(d) {
					return d.name
				}))
				//.range(["#f28244", "#f7c589", "#00a9c2", "#80d4e1", "#e36556", "#f3b4b9", "#8579b6", "#b3abd1", "#76bd64", "#c6e293", "#b164a5", "#dbb1d2", "#4a8bc6", "#a4c5e3", "#1ea3d8", "#80ccbf"]);
				.range(["#f28244", "#00a9c2", "#e36556", "#b164a5", "#dbb1d2", "#76bd64", "#c6e293", "#8579b6", "#b3abd1", "#4a8bc6", "#a4c5e3", "#1ea38d", "#80ccbf", "#f7c589", "#80d4e1", "#f3b4b9"]);
		}

	})

})(window, jQuery)
