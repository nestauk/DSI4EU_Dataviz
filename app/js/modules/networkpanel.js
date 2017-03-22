function NetworkPanel() {
	var self = this;
	self.fillPanel = fillPanel;
	self.deleteNetworkPanelItems = deleteNetworkPanelItems;

	function fillPanel(selectedOrg) {
		console.log(selectedOrg);

		$(".network-panel-title h2").text(selectedOrg.name);
		$(".network-panel-subtitle").text(selectedOrg.shared_prjs.length+" shared projects");

	}


	function deleteNetworkPanelItems() {
		
	}

}