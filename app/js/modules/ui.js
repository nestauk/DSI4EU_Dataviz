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

	$('#user-interface').hide();

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
		$("#filter-selection").hide();
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
				}, 500, "easeInOutQuart")
				$('#nav-map').addClass('current')
				break;
			case "network":
				$('#nav-current-bg').transition({
					left: "50%",
					x: "-50%"
				}, 500, "easeInOutQuart")
				$('#nav-network').addClass('current')
				break;
			case "cluster":
				$('#nav-current-bg').transition({
					left: "100%",
					x: "-100%"
				}, 500, "easeInOutQuart")
				$('#nav-cluster').addClass('current')
				break;
			default:
				$('#nav-map').addClass('current')
				break;
		}
	}

	function hideUI() {
		$('#user-interface').fadeOut();
	}

	function showUI() {
		if (!window.isMobile) openFilterPanel()
		$('#user-interface').fadeIn();
	}

	function openFilterPanel() {
		self.closeUIPanels();
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
			y: "-100%"
		}, 750, 'easeInOutQuint')
		$('.sub-nav-label').click(openFilterPanel)
		self.closeCurrentPanel = null;
	}

	function openSelectOverlay() {
		$('#filter-selection').fadeIn();
		$('body').on("click", closeSelectOverlay);
		$('#filter-selection .overlay-content').click(function(e) {
			e.stopPropagation();
		})
		$('#confirm-selection').click(closeSelectOverlay)
	}

	function closeSelectOverlay() {
		$('#confirm-selection').off();
		// APP.filter.createList(APP.filter.currentFieldSelection)
		$('body').off("click")
		$('#filter-selection').fadeOut(function() {
			$('#filter-select-list').empty();
		});
		APP.permalink.go();
	}

	function createFilterSections() {
		APP.filter_fields.forEach(function(f) {
			APP.filter.createList(f)
		})
	}

	function openSharePanel() {
		self.closeUIPanels();
		$("#share-button").off();
		// var share_copy = 'Share'
		// switch(APP.state){
		// 	case 'map':
		// 	share_copy = 'Share a map'
		// 	break;
		// 	case 'network':
		// 	share_copy = 'Share a network'
		// 	break;
		// 	case 'cluster':
		// 	share_copy = 'Share a cluster'
		// 	break;
		// }
		$(".share-panel").transition({
			y: 0
		});
		$(".share-container .close-modal").click(closeSharePanel);
		$(".share-icon").click(APP.share.social("dataviz", "http://digitalsocial.eu"));
		APP.share.embedLink("http://www.digitalsocial.eu/permalink");
		openToolsPanel($('#tools-share'), function() {
			$(".share-icon").off();
			$("#share-button").click(openSharePanel);
		})
	}

	function closeSharePanel() {
		$(".share-container .close-modal").off();
		$(".share-icon").off();
		$(".share-panel").transition({
			y: "100%"
		});
		$("#share-button").click(openSharePanel);
		self.closeCurrentPanel = null;
	}

	function openSearchPanel() {
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
		$("#info-button").off();
		console.log(APP.state)
		APP.infoPanel.delete(APP.state);
		openToolsPanel($('#info-' + APP.state), function() {
			$("#info-button").click(openInfoPanel)
		})
		APP.infoPanel.create(APP.state);
	}

	function openMapPanel(data) {
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
		if (self.resetTools) self.resetTools();
		$("#tools-panel .close-modal").off();
		$('#tools-panel').transition({
			y: "100%"
		}, 750, 'easeInOutQuint');
		self.closeCurrentPanel = null;
	}

	function openOrgList(orgs) {
		APP.orgList.delete();
		APP.orgList.create(orgs);
		self.closeUIPanels();
		$('.map-list').transition({
			y: 0
		});
		$(".remove-icon").click(closeOrgList);
		self.closeCurrentPanel = closeOrgList;
	}

	function closeOrgList() {
		$(".remove-icon").off();
		$('.map-list').transition({
			y: "100%"
		});
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
		});
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
		}, 500, "easeOutQuart");
		$('.map-list').transition({
			x: 0,
			complete: function() {
				APP.orgPanel.delete();
			}
		}, 500, "easeOutQuart");
		self.closeCurrentPanel = closeOrgList;
	}

	function closeOrgPanel() {
		$(".remove-icon").off();
		APP.orgPanel.delete();
		$('.map-panel').transition({
			x: "100%",
			complete: function() {
				APP.orgPanel.delete();
			}
		}, 500, "easeInQuart");
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
		}, 500, "easeOutQuart");
		$(".remove-icon").click(closeNetworkList);
		self.closeCurrentPanel = closeNetworkList;
	}

	function closeNetworkList() {
		$(".remove-icon").off();
		$(".network-list").transition({
			y: "100%"
		}, 500, "easeInQuart");
		self.closeCurrentPanel = null;
	}

	function openNetworkPanel(org) {
		APP.networkPanel.fillPanel(org)
		self.closeUIPanels();
		$('.network-panel').transition({
			x: 0
		}, 500, "easeOutQuart");
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
		}, 500, "easeOutQuart");
		$('.network-list').transition({
			x: 0,
			complete: function() {
				APP.networkPanel.deleteNetworkPanelItems();
			}
		}, 500, "easeOutQuart");
		self.closeCurrentPanel = closeNetworkList;
	}

	function closeNetworkPanel() {
		$(".remove-icon").off();
		$('.network-panel').transition({
			x: "100%",
			complete: function() {
				APP.networkPanel.deleteNetworkPanelItems();
			}
		}, 500, "easeInQuart");
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
		});
		$(".remove-icon").click(closeClusterPanel);
		self.closeCurrentPanel = closeClusterPanel;
	}

	function closeClusterPanel() {
		$(".remove-icon").off();
		$('.cluster-panel').transition({
			y: "100%"
		});
		self.closeCurrentPanel = null;
	}

	function closeUIPanels() {
		if (self.closeCurrentPanel) self.closeCurrentPanel();
	}

	function updateView(updateViewFunction) {
		if (self.updateViewFunction) self.updateViewFunction();
	}

}