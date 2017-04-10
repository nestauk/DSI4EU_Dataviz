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
	self.enableEmbedOverlay = enableEmbedOverlay

	self.updateView = updateView;
	self.updateViewFunction = null;

	var transitioning = false;

	var filter_tab = $('#filter-panel');
	var search_panel = $(".search-panel");

	$('#user-interface').css({
		opacity: 0
	})

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
		closeUIPanels();
		$('.sub-nav-label').html(APP.filter.createLabel())
		if(orientMQ.matches) APP.filter.createViewSettings();
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

	function trackGA(v) {
		if (window.ga) {
			var loc = window.location.pathname + v
			ga('set', 'page', loc)
			ga('send', 'pageview', loc)
		}
	}

	function hideUI() {
		$('#user-interface').transition({
			opacity: 0
		}, 750, 'easeInOutQuint');
	}

	function showUI() {
		if (orientMQ.matches) openFilterPanel()
		$('#user-interface').transition({
			opacity: 1
		}, 750, 'easeInOutQuint');
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
		if (orientMQ.matches) updateView();
	}

	function createFilterSections() {
		APP.filter_fields.forEach(function(f) {
			APP.filter.createList(f)
		})
	}

	function openFilterPanel() {
		closeUIPanels();
		$(".cluster-wrapper").off("click")
		APP.filter.createViewSettings();
		$('.sub-nav').addClass('open')
		$('.sub-nav-label').text("close")
		$('.sub-nav-label').off();
		filter_tab.transition({
			y: 0
		}, 750, 'easeInOutQuint')
		$('.sub-nav-label').click(closeFilterPanel)
		if (!orientMQ.matches) self.closeCurrentPanel = closeFilterPanel
	}

	function closeFilterPanel() {
		$('.sub-nav-label').off();
		$('.sub-nav-label').html(APP.filter.createLabel())
		$('.sub-nav').removeClass('open')
		filter_tab.transition({
			y: "-100%",
			complete: function() {
				updateView();
			}
		}, 750, 'easeInOutQuint')
		$('.sub-nav-label').click(openFilterPanel)
		self.closeCurrentPanel = null;
	}

	function openToolsPanel(view, reset) {
		if(self.closeCurrentPanel != closeToolsPanel){
			switchView();
			closeUIPanels();
		} else {
			closeUIPanels(switchView);
		}
		if (reset) self.resetTools = reset;
		$('#tools-panel').transition({
			y: 0
		}, 750, 'easeInOutQuint');
		$("#tools-panel .close-modal").click(function() {
			closeToolsPanel();
		});
		function switchView(){
			$('.tools-container').hide();
			if (view && view instanceof jQuery) view.show();
		}
		self.closeCurrentPanel = closeToolsPanel
	}

	function closeToolsPanel(callback) {
		if (self.resetTools) self.resetTools();
		$("#tools-panel .close-modal").off();
		$('#tools-panel').transition({
			y: "100%",
			complete: function(){
				if(callback) callback();
			}
		}, 750, 'easeInOutQuint');
		self.closeCurrentPanel = null;
		$('#share-button').removeClass('selected')
		$('#search-button').removeClass('selected')
		$('#info-button').removeClass('selected')
	}

	function openSharePanel() {
		$("#share-button").off()
		$(".share-icon").click(APP.share.social("Check out @DSI4EU's #dataviz showing the network of #DSI across Europe", "http://digitalsocial.eu"));
		APP.share.embedLink(APP.permalink.createUrl())
		openToolsPanel($('#tools-share'), function() {
			$(".share-icon").off();
			$("#share-button").removeClass('selected').click(openSharePanel)
		})
		$("#share-button").addClass('selected')
		trackGA('share')
	}

	function openSearchPanel() {
		$("#search-button").off()
		var search_hint = 'Search'
		switch (APP.state) {
			case 'map':
				search_hint = 'Find an organisation'
				break;
			case 'network':
				search_hint = 'Find a project or an organisation'
				break;
			case 'cluster':
				search_hint = 'Find ' + APP.dataset.fields.cluster_names_map[APP.cluster.cluster_field].toLowerCase();
				break;
		}
		$('#search-input').attr('placeholder', search_hint)
		if (orientMQ.matches) $('#search-input').focus()
		APP.search.reset();
		openToolsPanel($('#tools-search'), function() {
			$("#search-button").click(openSearchPanel);
		})
		$("#search-button").addClass('selected')
		trackGA('search')
	}

	function openInfoPanel() {
		$("#info-button").off()
		APP.infoPanel.delete(APP.state);
		openToolsPanel($('#info-' + APP.state), function() {
			if (APP.state === "map" && !APP.views.map.shown && !orientMQ.matches) {
				APP.coachMarks.showMapCoachmark()
			}
			$("#info-button").click(openInfoPanel)
		})
		APP.infoPanel.create(APP.state);
		$("#info-button").addClass('selected')
		trackGA('info')
	}

	function openMapPanel(data) {
		if (data.type && data.type == 'org') return openOrgPanel(data, false)
		if (data.orgs.length == 1) {
			openOrgPanel(data.orgs[0], false);
		} else {
			openOrgList(data);
		}
	}

	function openOrgList(orgs) {
		if(self.closeCurrentPanel != closeOrgList) closeUIPanels();
		APP.orgList.delete();
		APP.orgList.create(orgs);
		$('.map-list').transition({
			y: 0
		}, 750, 'easeInOutQuint');
		$(".remove-icon").click(function(){
			APP.map.resetFocus();
			closeOrgList()
		});
		self.closeCurrentPanel = closeOrgList;
	}

	function closeOrgList() {
		$(".remove-icon").off();
		$('.map-list').transition({
			y: "100%"
		}, 750, 'easeInOutQuint');
		self.closeCurrentPanel = null;
	}

	function openOrgPanel(org, list) {
		if(self.closeCurrentPanel != closeOrgPanel) closeUIPanels();
		if (list) {
			$(".back-icon").show();
		} else {
			$(".back-icon").hide();
			$(".modal-nav-icons").addClass("from-list");
		}
		APP.orgPanel.delete();
		APP.orgPanel.create(org);
		$('.map-panel').transition({
			x: 0
		}, 750, 'easeInOutQuint');
		$(".remove-icon").click(function(){
			APP.map.resetFocus();
			closeOrgPanel()
		});
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
		$(".remove-icon").off();
		$('.map-panel').transition({
			x: "100%"
		}, 750, "easeInOutQuint");
		$('.map-list').css({
			y: "100%",
			x: 0
		});
		self.closeCurrentPanel = null;
	}

	function openNetworkList(org) {
		if(self.closeCurrentPanel != closeNetworkList) closeUIPanels();
		APP.networkList.delete();
		APP.networkList.create(org)
		$(".network-list").transition({
			y: 0
		}, 750, 'easeInOutQuint');
		$(".remove-icon").click(closeNetworkList);
		self.closeCurrentPanel = closeNetworkList;
	}

	function closeNetworkList() {
		$(".remove-icon").off();
		$(".network-list").transition({
			y: "100%"
		}, 750, 'easeInOutQuint');
		self.closeCurrentPanel = null;
	}

	function openNetworkPanel(org) {
		if(self.closeCurrentPanel != closeNetworkPanel) closeUIPanels();
		APP.networkPanel.fillPanel(org)
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
		$(".remove-icon").off();
		$('.network-panel').transition({
			x: "100%",
			complete: function() {
				APP.networkPanel.deleteNetworkPanelItems();
			}
		}, 750, "easeInOutQuint");
		$('.network-list').css({
			y: "100%",
			x: 0
		});
		self.closeCurrentPanel = null;
	}

	function openClusterPanel(data) {
		if(self.closeCurrentPanel != closeClusterPanel) closeUIPanels();
		APP.clusterPanel.deleteClusterPanelItems();
		var selectedCluster = data;
		APP.clusterPanel.initPanel(selectedCluster);
		$('.cluster-panel').transition({
			y: 0
		}, 750, 'easeInOutQuint');
		$(".remove-icon").click(closeClusterPanel);
		self.closeCurrentPanel = closeClusterPanel;
	}

	function closeClusterPanel() {
		$(".remove-icon").off();
		$('.cluster-panel').transition({
			y: "100%"
		}, 750, 'easeInOutQuint');
		self.closeCurrentPanel = null;
	}

	function enableEmbedOverlay() {
		$('#embed-overlay').show();
		$('#embed-overlay').addClass(APP.state)
	}

	function closeUIPanels(callback) {
		if (self.closeCurrentPanel){		 
			if(callback) self.closeCurrentPanel(callback);
			else self.closeCurrentPanel();
		}
	}

	function updateView() {
		if (self.updateViewFunction) self.updateViewFunction();
	}

}
