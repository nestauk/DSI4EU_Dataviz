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
		APP.closeUIPanels = closeUIPanels;

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

	    var timeline = ["loader", "onboarding", "map", "network", "cluster", "share"];

	    APP.stator.go("loader", {encode: false})

	    APP.views = {
	    	map: {shown: false},
	    	network: {shown: false},
	    	cluster: {shown: false}
		  }

	    APP.dataset.loadData(function(){
	    	APP.filter.init();
	    	APP.stator.go('onboarding.one')
	    	APP.currentStateId = 1;
	    	APP.ui.init();

	    	createColorScales();
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

	    function closeUIPanels(){
	    	if(APP.closeCurrentPanel) APP.closeCurrentPanel();
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
		    		.domain(APP.dataset.fields["focus"].map(function (d) { return d.name }))
		    		.range(["#f28244", "#00a9c2", "#e36556", "#b164a5"]);

		    APP.supportColorScale = d3.scaleOrdinal()
		    		.domain(APP.dataset.fields["support_tags"].map(function (d) { return d.name }))
		    		.range(["#f28244", "#f7c589", "#00a9c2", "#80d4e1", "#e36556", "#f3b4b9", "#b164a5", "#dbb1d2", "#76bd64", "#c6e293"]);

		   	APP.techColorScale = d3.scaleOrdinal()
		    		.domain(APP.dataset.fields["technology"].map(function (d) { return d.name }))
		    		//.range(["#f28244", "#f7c589", "#00a9c2", "#80d4e1", "#e36556", "#f3b4b9", "#8579b6", "#b3abd1", "#76bd64", "#c6e293", "#b164a5", "#dbb1d2", "#4a8bc6", "#a4c5e3", "#1ea3d8", "#80ccbf"]);
		    		.range(["#f28244", "#00a9c2", "#e36556", "#b164a5", "#dbb1d2", "#76bd64", "#c6e293", "#8579b6", "#b3abd1", "#4a8bc6", "#a4c5e3", "#1ea38d", "#80ccbf", "#f7c589", "#80d4e1", "#f3b4b9"]);
	    }

  })
  

})(window, jQuery)