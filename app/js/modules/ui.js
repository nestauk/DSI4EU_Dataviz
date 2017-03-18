function UserInterface() {
	var self = this;
	self.updateNavigation = updateNavigation;
	self.hide = hideUI;
	self.show = showUI;
	self.init = init;
	self.openSelection = openSelectOverlay;
	self.closeSelection = closeSelectOverlay;
	self.closeSearchPanel = closeSearchPanel;

	//made visible from outside to be used by orglist.js
	self.openOrgPanel = openOrgPanel;
	self.closeOrgPanel = closeOrgPanel;

	var nav_next = $('#nav-next');
	var nav_current = $('#nav-current');
	var nav_prev = $('#nav-prev');

	var filter_tab = $('#filter-panel');
	var search_panel = $(".search-panel");

	$('#user-interface').hide();

	function init(){
		updateNavigation();	
		createFilterSections()
		$("#filter-selection").hide();
		$(".sub-nav-label").click(openFilterTab);
		$("#share-button").click(loadOrgPanelOrList);
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
		APP.filter.createViewSettings();
		$('.sub-nav-label').text("close filters")
		$('.sub-nav-label').off();
		filter_tab.transition({ y: 0})
		$('.sub-nav-label').click(closeFilterTab)
		APP.closeUIPanels = closeFilterTab
	}

	function closeFilterTab(){
		$('.sub-nav-label').off();
		$('.sub-nav-label').text("filters")
		filter_tab.transition({ y: "-100%"})
		$('.sub-nav-label').click(openFilterTab)
		APP.closeUIPanels = null;
	}

	function openSelectOverlay(){
		$('#filter-selection').fadeIn();
		$('body').on("click",function(e) {
			closeSelectOverlay();
		});
		$('#filter-selection .overlay-content').click(function(e){
			e.stopPropagation();
		}) 
		$('#filter-selection .close-modal').click(closeSelectOverlay)
	}

	function closeSelectOverlay(){
		APP.filter.createList(APP.filter.currentFieldSelection)
		$('body').off("click")
		$('#filter-selection').fadeOut(function(){
			$('#filter-select-list').empty();
		});
	}

	function createFilterSections(){
		APP.filter_fields.forEach(function(f){
			APP.filter.createList(f)
		})
	}

	function openSearchPanel() {
		if(APP.closeUIPanels) APP.closeUIPanels();
		$("#search-button").off();
		$('#search-input').focus()
		APP.search.reset();
		search_panel.transition({ y: 0});
		$(".search-container .close-modal").click(closeSearchPanel);
		APP.closeUIPanels = closeSearchPanel
	}

	function closeSearchPanel() {
		$(".search-container .close-modal").off();
		search_panel.transition({ y: "100%"});
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

	function loadOrgPanelOrList() {
		var selectedOrgs = APP.dataset.orgs.filter(function (d) {
			//return d.name == "Nesta" || d.name == "Waag Society";
			return d.name == "Nesta";
		})
		if (selectedOrgs.length == 1) {
			openOrgPanel(selectedOrgs[0], false); //only one org, go directly to OrgPanel
		}
		else {
			openOrgList(selectedOrgs); //more than one org, go to orgList
		}
	}

	function openOrgList(_selectedOrgs) {
		APP.orgList.deleteOrgListItems();
		APP.orgList.fillList(_selectedOrgs);
		if(APP.closeUIPanels) APP.closeUIPanels();
		$("#share-button").off();
		$('.org-list-map').transition({ y: 0});
		$(".remove-icon").click(closeOrgList);
		APP.closeUIPanels = closeOrgList;
	}

	function closeOrgList() {
		$(".remove-icon").off();
		$('.org-list-map').transition({ y:"100%" });
		$("#share-button").click(loadOrgPanelOrList);
		APP.closeUIPanels = null;
	}

	function openOrgPanel(selectedOrg, manyOrg) {
		manyOrg ? $(".back-icon").show() : $(".back-icon").hide() //manyOrg is true if coming from OrgList, false if coming from the map
		APP.orgPanel.fillHeader(selectedOrg);
		var radarData = APP.orgPanel.prepareData(selectedOrg, "technology");
		APP.orgPanel.drawRadar(radarData, "Technology");
		var barchart1Data = APP.orgPanel.prepareData(selectedOrg, "focus");
		APP.orgPanel.drawBarChart(barchart1Data, "Focus");
		var barchart2Data = APP.orgPanel.prepareData(selectedOrg, "support_tags");
		APP.orgPanel.drawBarChart(barchart2Data, "Support");
		if(APP.closeUIPanels) APP.closeUIPanels();
		$("#share-button").off();
		$('.org-panel-map').transition({ x: 0});
		$(".remove-icon").click(closeOrgPanel);
		$(".back-icon").click(backToOrgList);
		APP.closeUIPanels = closeOrgPanel;
	}

	function backToOrgList() {
		$(".back-icon").off();
		APP.orgPanel.deleteOrgPanelItems();
		$('.org-panel-map').transition({ x:"-100%" });
		$('.org-list-map').transition({ y: 0});
		APP.closeUIPanels = null;
	}

	function closeOrgPanel() {
		$(".remove-icon").off();
		APP.orgPanel.deleteOrgPanelItems();
		$('.org-panel-map').transition({ x:"-100%" });
		$('.org-list-map').transition({ y:"100%" });
		$("#share-button").click(loadOrgPanelOrList);
		APP.closeUIPanels = null;
	}

}