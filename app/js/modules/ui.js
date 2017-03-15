function UserInterface() {
	var self = this;
	self.updateNavigation = updateNavigation;
	self.hide = hideUI;
	self.show = showUI;
	self.init = init;

	var nav_next = $('#nav-next');
	var nav_current = $('#nav-current');
	var nav_prev = $('#nav-prev');

	var info_panel = $(".info-panel");
	var filter_tab = $('#filter-tab');

	$('#user-interface').hide();

	function init(){
		$('#user-interface').show();
		updateNavigation();	
		addInfo();
		createFilterSections()
	}

	function addNavInteractions(){
		nav_next.off();
		nav_prev.off();
		if(APP.state != "cluster"){
			nav_next.click(function(){
				APP.moveForward();
			})
		}
		if(APP.state != "map"){
			nav_prev.click(function(){
				APP.moveBackward();
			})
		}

		$('.sub-nav-label').click(openFilterTab);
		$("#info-button").click(openInfoPanel);
	}

	function openInfoPanel() {
		$("#info-button").off();
		info_panel.transition({ y: "-8.5rem"});
		info_panel.click(closeInfoPanel)
	}

	function closeInfoPanel() {
		info_panel.off();
		info_panel.transition({ y: "100%"});
		$("#info-button").click(openInfoPanel);
	}

	function updateNavigation(){
		addNavInteractions();
		var nav_map = $('#nav-map');
		var nav_network = $('#nav-network');
		var nav_cluster = $('#nav-cluster');
		switch(APP.state){
			case "map":
				nav_current.append(nav_map);
				nav_next.prepend(nav_network);
				nav_prev.append(nav_cluster);
			break;
			case "network":
				nav_current.append(nav_network);
				nav_next.prepend(nav_cluster);
				nav_prev.append(nav_map);
			break;
			case "cluster":
				nav_current.append(nav_cluster);
				nav_next.prepend(nav_map);
				nav_prev.append(nav_network);
			break;
			default:
				nav_current.append(nav_map);
				nav_next.prepend(nav_network);
				nav_prev.append(nav_cluster);
			break;
		}
	}

	function openFilterTab(){
		$('.sub-nav-label').off();
		filter_tab.transition({ y: 0})
		$('.sub-nav-label').click(closeFilterTab)
	}

	function closeFilterTab(){
		$('.sub-nav-label').off();
		filter_tab.transition({ y: "-100%"})
		$('.sub-nav-label').click(openFilterTab)
	}

	function hideUI(){
		$('#user-interface').fadeOut();
	}

	function showUI(){
		$('#user-interface').fadeIn();
	}

	function openSelectOverlay(){
		
	}

	function createFilterSections(){
		APP.filter_fields.forEach(function(f){
			var id = "#filter-"+f;
			if($(id).length > 0) APP.filter.createList(f, id)
		})
	}

}