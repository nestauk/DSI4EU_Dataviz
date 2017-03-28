function UserInterface() {
	var self = this;
	self.updateNavigation = updateNavigation;
	self.hide = hideUI;
	self.show = showUI;
	self.init = init;

	self.openSelection = openSelectOverlay;
	self.closeSelection = closeSelectOverlay;

	// UI Panels
	self.closeSearchPanel = closeSearchPanel;
	self.openFilterTab = openFilterTab;
	self.openMapPanel = openMapPanel
	self.openOrgPanel = openOrgPanel
	self.openOrgList = openOrgList
	self.closeOrgList = closeOrgList
	self.closeOrgPanel = closeOrgPanel;
	self.openNetworkList = openNetworkList;
	self.openNetworkPanel = openNetworkPanel;
	self.closeNetworkPanel = closeNetworkPanel;
	self.openNetworkStats = openNetworkStats;
	self.closeNetworkStats = closeNetworkStats;
	self.openClusterPanel = openClusterPanel;

	self.updateView = updateView;
	self.updateViewFunction = null;

	var nav_next = $('#nav-next');
	var nav_current = $('#nav-current');
	var nav_prev = $('#nav-prev');

	var filter_tab = $('#filter-panel');
	var search_panel = $(".search-panel");

	$('#user-interface').hide();

	function init(){
		updateNavigation();	
		$('#clear-all-filters').click(function(){
			APP.filter.resetFilters()
			createFilterSections()
		});
		$('#clear-all-filters').hide();
		createFilterSections();
		$("#filter-selection").hide();
		$(".sub-nav-label").click(openFilterTab);
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
		$('.sub-nav-label').html(APP.filter.createLabel())
		filter_tab.transition({ y: "-100%", complete: function(){
			updateView();
		}})
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
		var search_hint = 'Search'
		switch(APP.state){
			case 'map':
			search_hint = 'Find an organisation'
			break;
			case 'network':
			search_hint = 'Find a project or an organisation'
			break;
			case 'cluster':
			search_hint = 'Find a cluster group'
			break;
		}
		$('#search-input').attr('placeholder', search_hint)
		if(!window.isMobile) $('#search-input').focus()
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
		$(".network-stats-button button").click(openNetworkStats);
		APP.closeUIPanels = closeInfoPanel
	}

	function closeInfoPanel() {
		$(".remove-icon").off();
		$('.info-panel.'+APP.state).transition({ y:"100%" });
		$("#info-button").click(openInfoPanel);
		APP.closeUIPanels = null;
	}

	function openMapPanel(data) {
		if (data.orgs.length == 1) {
			openOrgPanel(data.orgs[0], false); 
		}
		else {
			openOrgList(data); 
		}
	}

	function openOrgList(orgs) {
		APP.orgList.delete();
		APP.orgList.create(orgs);
		if(APP.closeUIPanels) APP.closeUIPanels();
		$('.map-list').transition({ y: 0});
		$(".remove-icon").click(closeOrgList);
		APP.closeUIPanels = closeOrgList;
	}

	function closeOrgList() {
		$(".remove-icon").off();
		$('.map-list').transition({ y:"100%" });
		APP.closeUIPanels = null;
	}

	function openOrgPanel(org, list) {
		if (list) {
			$(".back-icon").show();
		} else {
			$(".back-icon").hide();
			$(".modal-nav-icons").addClass("from-list");
		}
		APP.orgPanel.create(org);
		if(APP.closeUIPanels) APP.closeUIPanels();
		$('.map-panel').transition({ x: 0});
		$(".remove-icon").click(closeOrgPanel);
		$(".back-icon").click(backToOrgList);
		APP.closeUIPanels = closeOrgPanel;
	}

	function backToOrgList() {
		$(".back-icon").off();
		$('.map-list').css({ y: 0});
		$('.map-panel').transition({ x:"-100%" }, 500, "easeOutQuart");
		$('.map-list').transition({ x: 0, complete: function() {
				APP.orgPanel.delete();
			}
		}, 500, "easeOutQuart");
		APP.closeUIPanels = null;
	}

	function closeOrgPanel() {
		$(".remove-icon").off();
		APP.orgPanel.delete();
		$('.map-panel').transition({ x:"-100%", complete: function() {
				APP.orgPanel.delete();
			}
		}, 500, "easeInQuart");
		$('.map-list').css({ y:"100%", x: 0 });
		APP.closeUIPanels = null;
	}

	function openNetworkStats() {
		$(".network-stats-button button").off();
		APP.networkStats.delete();
		if(APP.closeUIPanels) APP.closeUIPanels();
		APP.networkStats.create();
		$(".network-stats").css({scale: 0, transformOrigin: '100% 100%'})
		setTimeout(function(){	
			$(".network-stats").transition({ scale: 1 }, 500, "easeOutQuart");
		}, 1000)
		$(".remove-icon").click(closeNetworkStats);
		APP.closeUIPanels = closeNetworkStats;
	}

	function closeNetworkStats() {
		$(".remove-icon").off();
		$(".network-stats").transition({ scale: 0}, 500, "easeInQuart");
		APP.closeUIPanels = null;
	}

	function openNetworkList(org) {
		APP.networkList.delete();
		if(APP.closeUIPanels) APP.closeUIPanels();
		APP.networkList.create(org)
		$(".network-list").transition({ y: 0 }, 500, "easeOutQuart");
		$(".remove-icon").click(closeNetworkList);
		APP.closeUIPanels = closeNetworkList;
	}

	function closeNetworkList() {
		$(".remove-icon").off();
		$(".network-list").transition({ y: "100%"}, 500, "easeInQuart");
		APP.closeUIPanels = null;
	}

	function openNetworkPanel(org) {
		APP.networkPanel.fillPanel(org)
		if(APP.closeUIPanels) APP.closeUIPanels();
		$('.network-panel').transition({ x: 0}, 500, "easeOutQuart");
		$(".remove-icon").click(closeNetworkPanel);
		$(".back-icon").click(backToNetworkList);
		APP.closeUIPanels = closeNetworkPanel;
	}

	function backToNetworkList() {
		$(".back-icon").off();
		$('.network-list').css({ y: 0});
		$('.network-panel').transition({ x:"-100%" }, 500, "easeOutQuart");
		$('.network-list').transition({ x: 0, complete: function() {
				APP.networkPanel.deleteNetworkPanelItems();
			}
		}, 500, "easeOutQuart");
		APP.closeUIPanels = null;
	}

	function closeNetworkPanel() {
		$(".remove-icon").off();
		$('.network-panel').transition({ x:"-100%", complete: function() {
				APP.networkPanel.deleteNetworkPanelItems();
			}
		}, 500, "easeInQuart");
		$('.network-list').css({ y:"100%", x: 0 });
		APP.closeUIPanels = null;
	}

	function openClusterPanel(data) {
		var selectedCluster = data;
		APP.clusterPanel.fillHeader(selectedCluster);
		APP.clusterPanel.drawPanel(selectedCluster);
		if(APP.closeUIPanels) APP.closeUIPanels();
		$('.cluster-panel').transition({ y: 0});
		$(".remove-icon").click(closeClusterPanel);
		APP.closeUIPanels = closeClusterPanel;
	}

	function closeClusterPanel() {
		$(".remove-icon").off();
		$('.cluster-panel').transition({ y:"100%" });
		APP.clusterPanel.deleteClusterPanelItems();
		APP.closeUIPanels = null;
	}

	function updateView(updateViewFunction){
		if(self.updateViewFunction) self.updateViewFunction();
	}

}