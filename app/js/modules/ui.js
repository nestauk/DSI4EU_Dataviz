function UserInterface() {
	var self = this;
	self.updateNavigation = updateNavigation;
	self.hide = hideUI;
	self.show = showUI;
	self.init = init;

	self.openSelection = openSelectOverlay;
	self.closeSelection = closeSelectOverlay;

	// UI Panels
	self.openFilterPanel = openFilterPanel;
	self.openInfoPanel = openInfoPanel;
	self.openMapPanel = openMapPanel
	self.openOrgPanel = openOrgPanel
	self.openOrgList = openOrgList
	self.closeOrgList = closeOrgList
	self.closeOrgPanel = closeOrgPanel;
	self.openNetworkList = openNetworkList;
	self.openNetworkPanel = openNetworkPanel;
	self.closeNetworkPanel = closeNetworkPanel;
	self.openClusterPanel = openClusterPanel;
	self.closeUIPanels = closeUIPanels

	self.updateView = updateView;
	self.updateViewFunction = null;

	var filter_tab = $('#filter-panel');
	var search_panel = $(".search-panel");

	var thereIsAPanel = false

	$('#user-interface').css({opacity:0})

	function init() {
		updateNavigation();
		$('#nav-map').click(function() {
			APP.stator.go("map")
		})
		$('#nav-network').click(function() {
			APP.stator.go("network")
		})
		$('#nav-cluster').click(function() {
			APP.stator.go("cluster")
		})
		$('#clear-all-filters').click(function() {
			APP.filter.resetFilters()
			createFilterSections()
		});
		$('#clear-all-filters').hide();
		createFilterSections();
		$("#filter-selection").hide()
		$(".sub-nav-label").click(openFilterPanel);
		$("#share-button").click(openSharePanel);
		$("#search-button").click(openSearchPanel);
		$("#info-button").click(openInfoPanel);
		$('.tools-container').hide();
	}

	function updateNavigation() {
		self.closeUIPanels();
		$('.sub-nav-label').html(APP.filter.createLabel())
		if (!window.isMobile) APP.filter.createViewSettings();
		$('.nav .current').removeClass('current')
		switch (APP.state) {
			case "map":
				$('#nav-current-bg').transition({
					left: "0%",
					x: "0%"
				}, 750, "easeInOutQuint")
				$('#nav-map').addClass('current')
				break;
			case "network":
				$('#nav-current-bg').transition({
					left: "50%",
					x: "-50%"
				}, 750, "easeInOutQuint")
				$('#nav-network').addClass('current')
				break;
			case "cluster":
				$('#nav-current-bg').transition({
					left: "100%",
					x: "-100%"
				}, 750, "easeInOutQuint")
				$('#nav-cluster').addClass('current')
				break;
			default:
				$('#nav-map').addClass('current')
				break;
		}
	}

	function hideUI() {
		$('#user-interface').transition({opacity:0}, 750, 'easeInOutQuint');
	}

	function showUI() {
		if (!window.isMobile) openFilterPanel()
		$('#user-interface').transition({opacity:1}, 750, 'easeInOutQuint');
	}

	function openFilterPanel() {
		self.closeUIPanels();
		$(".cluster-wrapper").off("click")
		APP.filter.createViewSettings();
		$('.sub-nav').addClass('open')
		$('.sub-nav-label').text("close")
		$('.sub-nav-label').off();
		filter_tab.transition({
			y: 0
		}, 750, 'easeInOutQuint')
		$('.sub-nav-label').click(closeFilterPanel)
		if (window.isMobile) self.closeCurrentPanel = closeFilterPanel
	}

	function closeFilterPanel() {
		$('.sub-nav-label').off();
		$('.sub-nav-label').html(APP.filter.createLabel())
		$('.sub-nav').removeClass('open')
		filter_tab.transition({
			y: "-100%",
			complete: function(){
				updateView();
			}
		}, 750, 'easeInOutQuint')
		$('.sub-nav-label').click(openFilterPanel)
		self.closeCurrentPanel = null;
	}

	function openSelectOverlay() {
		$('#filter-selection').fadeIn()
		$('body').on("click", closeSelectOverlay);
		$('#filter-selection .overlay-content').click(function(e) {
			e.stopPropagation();
		})
		$('#confirm-selection').click(closeSelectOverlay)
	}

	function closeSelectOverlay() {
		$('#confirm-selection').off();
		$('body').off("click")
		$('#filter-selection').fadeOut(function() {
			$('#filter-select-list').empty();
		})
		APP.permalink.go();
		if(!window.isMobile) updateView();
	}

	function createFilterSections() {
		APP.filter_fields.forEach(function(f) {
			APP.filter.createList(f)
		})
	}

	function openSharePanel() {
		console.log('open share')
		self.closeUIPanels();
		$("#share-button").off();
		$(".share-panel").transition({
			y: 0
		}, 750, 'easeInOutQuint');
		$(".share-container .close-modal").click(closeSharePanel);
		$(".share-icon").click(APP.share.social("Check out @DSI4EU's #dataviz showing the network of #DSI across Europe", "http://digitalsocial.eu"));
		APP.share.embedLink(APP.permalink.createUrl());
		openToolsPanel($('#tools-share'), function() {
			$(".share-icon").off();
			$("#share-button").click(openSharePanel);
		})
	}

	function closeSharePanel() {
		var t = (self.closeCurrentPanel) ? 0 : 750
		console.log('close share', t)
		$(".share-container .close-modal").off();
		$(".share-icon").off();
		$(".share-panel").transition({
			y: "100%"
		}, t, 'easeInOutQuint');
		$("#share-button").click(openSharePanel);
		self.closeCurrentPanel = null;
	}

	function openSearchPanel() {
		console.log('open search')
		$("#search-button").off();
		var search_hint = 'Search'
		switch (APP.state) {
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
		if (!window.isMobile) $('#search-input').focus()
		APP.search.reset();
		openToolsPanel($('#tools-search'), function() {
			$("#search-button").click(openSearchPanel);
		})
	}

	function openInfoPanel() {
		console.log('open infopanel')
		$("#info-button").off();
		APP.infoPanel.delete(APP.state);
		openToolsPanel($('#info-' + APP.state), function() {
			$("#info-button").click(openInfoPanel)
		})
		APP.infoPanel.create(APP.state);
	}

	function openMapPanel(data) {
		console.log('open infopanel')
		if (data.type && data.type == 'org') return openOrgPanel(data, false)
		if (data.orgs.length == 1) {
			openOrgPanel(data.orgs[0], false);
		} else {
			openOrgList(data);
		}
	}

	function openToolsPanel(view, reset) {
		self.closeUIPanels();
		$('.tools-container').hide();
		if (view && view instanceof jQuery) view.show();
		$('#tools-panel').transition({
			y: 0
		}, 750, 'easeInOutQuint');
		if(reset) self.resetTools = reset;
		$("#tools-panel .close-modal").click(function() {
			closeToolsPanel(view);
		});
		self.closeCurrentPanel = closeToolsPanel
	}

	function closeToolsPanel(view) {
		var t = (self.closeCurrentPanel) ? 0 : 750
		console.log('close tool', t)
		if (self.resetTools) self.resetTools();
		$("#tools-panel .close-modal").off();
		$('#tools-panel').transition({
			y: "100%"
		}, t, 'easeInOutQuint');
		self.closeCurrentPanel = null;
		thereIsAPanel=false
	}

	function openOrgList(orgs) {
		APP.orgList.delete();
		APP.orgList.create(orgs);
		self.closeUIPanels();
		$('.map-list').transition({
			y: 0
		}, 750, 'easeInOutQuint');
		$(".remove-icon").click(closeOrgList);
		self.closeCurrentPanel = closeOrgList;
	}

	function closeOrgList() {
		var t = (self.closeCurrentPanel) ? 0 : 750
		$(".remove-icon").off();
		$('.map-list').transition({
			y: "100%"
		}, t, 'easeInOutQuint');
		self.closeCurrentPanel = null;
	}

	function openOrgPanel(org, list) {
		if (list) {
			$(".back-icon").show();
		} else {
			$(".back-icon").hide();
			$(".modal-nav-icons").addClass("from-list");
		}
		APP.orgPanel.create(org);
		self.closeUIPanels();
		$('.map-panel').transition({
			x: 0
		}, 750, 'easeInOutQuint');
		$(".remove-icon").click(closeOrgPanel);
		$(".back-icon").click(backToOrgList);
		self.closeCurrentPanel = closeOrgPanel;
	}

	function backToOrgList() {
		$(".back-icon").off();
		$('.map-list').css({
			y: 0
		});
		$('.map-panel').transition({
			x: "100%"
		}, 750, "easeInOutQuint");
		$('.map-list').transition({
			x: 0,
			complete: function() {
				APP.orgPanel.delete();
			}
		}, 750, "easeInOutQuint");
		self.closeCurrentPanel = closeOrgList;
	}

	function closeOrgPanel() {
		var t = (self.closeCurrentPanel) ? 0 : 750
		$(".remove-icon").off();
		APP.orgPanel.delete();
		$('.map-panel').transition({
			x: "100%",
			complete: function() {
				APP.orgPanel.delete();
			}
		}, t, "easeInOutQuint");
		$('.map-list').css({
			y: "100%",
			x: 0
		});
		self.closeCurrentPanel = null;
	}

	function openNetworkList(org) {
		APP.networkList.delete();
		self.closeUIPanels();
		APP.networkList.create(org)
		$(".network-list").transition({
			y: 0
		}, 750, 'easeInOutQuint');
		$(".remove-icon").click(closeNetworkList);
		self.closeCurrentPanel = closeNetworkList;
	}

	function closeNetworkList() {
		var t = (self.closeCurrentPanel) ? 0 : 750
		$(".remove-icon").off();
		$(".network-list").transition({
			y: "100%"
		}, t, 'easeInOutQuint');
		self.closeCurrentPanel = null;
	}

	function openNetworkPanel(org) {
		APP.networkPanel.fillPanel(org)
		self.closeUIPanels();
		$('.network-panel').transition({
			x: 0
		}, 750, 'easeInOutQuint');
		$(".remove-icon").click(closeNetworkPanel);
		$(".back-icon").click(backToNetworkList);
		self.closeCurrentPanel = closeNetworkPanel;
	}

	function backToNetworkList() {
		$(".back-icon").off();
		$('.network-list').css({
			y: 0
		});
		$('.network-panel').transition({
			x: "100%"
		}, 750, "easeInOutQuint");
		$('.network-list').transition({
			x: 0,
			complete: function() {
				APP.networkPanel.deleteNetworkPanelItems();
			}
		}, 750, "easeInOutQuint");
		self.closeCurrentPanel = closeNetworkList;
	}

	function closeNetworkPanel() {
		var t = (self.closeCurrentPanel) ? 0 : 750
		$(".remove-icon").off();
		$('.network-panel').transition({
			x: "100%",
			complete: function() {
				APP.networkPanel.deleteNetworkPanelItems();
			}
		}, t, "easeInOutQuint");
		$('.network-list').css({
			y: "100%",
			x: 0
		});
		self.closeCurrentPanel = null;
	}

	function openClusterPanel(data) {
		// off listeneres on clusters?
		APP.clusterPanel.deleteClusterPanelItems();
		var selectedCluster = data;
		APP.clusterPanel.initPanel(selectedCluster);
		self.closeUIPanels();
		$('.cluster-panel').transition({
			y: 0
		}, 750, 'easeInOutQuint');
		$(".remove-icon").click(closeClusterPanel);
		self.closeCurrentPanel = closeClusterPanel;
	}

	function closeClusterPanel() {
		var t = (self.closeCurrentPanel) ? 0 : 750
		$(".remove-icon").off();
		$('.cluster-panel').transition({
			y: "100%"
		}, t, 'easeInOutQuint');
		self.closeCurrentPanel = null;
	}

	function closeUIPanels() {
		if (self.closeCurrentPanel) self.closeCurrentPanel();
	}

	function updateView() {
		if (self.updateViewFunction) self.updateViewFunction();
	}

}