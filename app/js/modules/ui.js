function UserInterface() {
	var self = this;
	self.updateNavigation = updateNavigation;
	self.hide = hideUI;
	self.show = showUI;
	self.init = init;
	self.openSelection = openSelectOverlay;
	self.closeSelection = closeSelectOverlay;
	self.closeSearchPanel = closeSearchPanel;

	var nav_next = $('#nav-next');
	var nav_current = $('#nav-current');
	var nav_prev = $('#nav-prev');

	var filter_tab = $('#filter-tab');
	var search_panel = $(".search-panel");

	$('#user-interface').hide();

	function init(){
		updateNavigation();	
		createFilterSections()
		$('#filter-selection').hide();
		$('.sub-nav-label').click(openFilterTab);
		$("#share-button").click(function () {
			openOrgPanel(APP.dataset.orgs[0]);
		});
		$("#search-button").click(openSearchPanel);
		$("#info-button").click(openInfoPanel);
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
	
	function hideUI(){
		$('#user-interface').fadeOut();
	}

	function showUI(){
		$('#user-interface').fadeIn();
	}

	function openFilterTab(){
		if(APP.closeUIPanels) APP.closeUIPanels();
		$('.sub-nav-label').off();
		filter_tab.transition({ y: 0})
		$('.sub-nav-label').click(closeFilterTab)
		APP.closeUIPanels = closeFilterTab
	}

	function closeFilterTab(){
		$('.sub-nav-label').off();
		filter_tab.transition({ y: "-100%"})
		$('.sub-nav-label').click(openFilterTab)
		APP.closeUIPanels = null;
	}

	function openSelectOverlay(){
		$('#filter-selection').fadeIn();
		$('#filter-selection .close-modal').click(closeSelectOverlay)
	}

	function closeSelectOverlay(){
		APP.filter.createList(APP.filter.currentFieldSelection)
		$('#filter-selection').fadeOut(function(){
			$('#filter-select-list').empty();
		});
		APP.closeUIPanels = null;
	}

	function createFilterSections(){
		APP.filter_fields.forEach(function(f){
			APP.filter.createList(f)
		})
	}

	function openSearchPanel() {
		if(APP.closeUIPanels) APP.closeUIPanels();
		$("#search-button").off();
		APP.search.reset();
		search_panel.transition({ y: "75%"});
		$(".search-icon-header").click(closeSearchPanel);
		APP.closeUIPanels = closeSearchPanel
	}

	function closeSearchPanel() {
		$(".search-icon-header").off();
		$(".search-icon-header").transition({ y: 0});
		search_panel.transition({ y: "200%"});
		$("#search-button").click(openSearchPanel);
		APP.closeUIPanels = null;
	}

	function openInfoPanel() {
		if(APP.closeUIPanels) APP.closeUIPanels();
		$("#info-button").off();
		$('.info-panel.'+APP.state).transition({ y: 0});
		$(".remove-icon").click(closeInfoPanel);
		APP.closeUIPanels = closeInfoPanel
	}

	function closeInfoPanel() {
		$(".remove-icon").off();
		$('.info-panel.'+APP.state).transition({ y:"100%" });
		$("#info-button").click(openInfoPanel);
		APP.closeUIPanels = null;
	}

	function openOrgPanel(selectedOrgs) {
		console.log(selectedOrgs)
		if(APP.closeUIPanels) APP.closeUIPanels();
		$("#share-button").off();
		$('.org-panel-map').transition({ y: 0});
		$(".remove-icon").click(closeOrgPanel);
		APP.closeUIPanels = closeOrgPanel
	}

	function closeOrgPanel() {
		$(".remove-icon").off();
		$('.org-panel-map').transition({ y:"100%" });
		$("#share-button").click(openOrgPanel);
		APP.closeUIPanels = null;
	}

}