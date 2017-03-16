function OrgPanel() {
	var self = this;
	self.fillHeader = fillHeader;
	self.currentOrgSelection = null;

	function fillHeader(_selectedOrgs) {
		console.log(_selectedOrgs)
		$(".org-panel-map-container h2").html(_selectedOrgs[0].name);
		$(".org-panel-map-container .org-type").html(_selectedOrgs[0].organisation_type);
		$(".org-panel-map-container .org-panel-scrolling p").html(_selectedOrgs[0].short_description);
	}
}