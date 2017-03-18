function OrgList() {
	var self = this;
	self.fillList = fillList;
	self.deleteOrgListItems = deleteOrgListItems;

	function fillList(_selectedOrgs) {

		d3.select(".org-list-map-container h3")
			.text(_selectedOrgs[0].region)

		d3.select(".org-list ul").selectAll(".org-list-item")
			.data(_selectedOrgs)
			.enter()
			.append("li")
			.attr("class", "org-list-item")
			.text(function (d) {
				return d.name;
			})
			.on("click", function (d) {
				toOrgPanel(d);
			})
	}

	function toOrgPanel(_org) {
		$('.org-list-map').transition({ y:"100%" });
		$('.org-panel-map').transition({ y:0 });
		APP.ui.openOrgPanel(_org, true); //more than one org, go to orgList
	}

	function deleteOrgListItems() {
    d3.selectAll(".org-list .org-list-item").remove();
  }

}