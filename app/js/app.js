;(function(window, $, undefined){

	window.APP = {}
	APP.currentStateId = 0;
	APP.filter_fields = ["support_tags", "technology", "networkTags", "organisation_type"];

	$(document).ready(function(){
		APP.dataset = new Dataset();	
		
		APP.setState = setState;
		APP.moveForward = moveForward;
		APP.moveBackward = moveBackward;
		APP.getColorScale = getColorScale;

		APP.filter = new Filter();
		APP.orgList = new OrgList();
		APP.orgPanel = new OrgPanel();
		APP.networkList = new NetworkList();
		APP.networkPanel = new NetworkPanel();
		APP.networkStats = new NetworkStats();
		APP.clusterPanel = new ClusterPanel();
		APP.search = new Search();
		APP.ui = new UserInterface();

	    var timeline = ["loader", "onboarding", "map", "network", "cluster", "share"];

	    APP.stator.go("loader", {encode: false})

	    APP.dataset.loadData(function(){
	    	APP.filter.init();
	    	APP.stator.go('onboarding.one')
	    	APP.currentStateId = 1;
	    	APP.ui.init();
	    })

	    APP.stator.on("moveForward", moveForward);
	    APP.stator.on("moveBackward", moveBackward);

	    function moveForward(){
	      if(APP.closeUIPanels) APP.closeUIPanels();
	      APP.stator.direction = "up";
	      if(APP.currentStateId < timeline.length-1){
	        APP.stator.go(timeline[++APP.currentStateId], {encode: false});
	      }
	      console.log(APP.currentStateId);
	      APP.ui.updateNavigation()
	    }

	    function moveBackward(){
	      if(APP.closeUIPanels) APP.closeUIPanels();
	      APP.stator.direction = "down";
	      if(APP.currentStateId > 0) {
	        APP.stator.go(timeline[--APP.currentStateId], {encode: false});
	      }
	      console.log(APP.currentStateId);
	      APP.ui.updateNavigation()
	    }


	    // listeners
	    window.addEventListener("keydown", doKeyDown, true);

	    function doKeyDown(e){
	      if(e.key === "ArrowRight") {
	        moveForward();
	      }
	      if(e.key === "ArrowLeft") {
	        moveBackward();
	      }
	    }

	    function setState(state){
	    	$('body').removeClass(APP.state)
	    	APP.state = state;
	    	$('body').addClass(APP.state)
	    }

	    function getColorScale(field) {
	    	if(field == 'focus') {
		    	return d3.scaleOrdinal()
		    		.domain(APP.dataset.fields["focus"])
		    		.range(["#f1d569", "#ffad69", "#ff6769", "#f169c4"]);
	    	} else {
		    	return d3.scaleOrdinal()
		    		.domain(APP.dataset.fields[field])
		    		.range(d3.schemeCategory20);
	    	}

	    }

  })



})(window, jQuery)