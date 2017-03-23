function OrgList() {
	var self = this;
	self.fillList = fillList;
	self.deleteOrgListItems = deleteOrgListItems;

	function fillList(_selectedOrgs) {

		d3.select(".map-list-container h3")
			.text(_selectedOrgs[0].region)

		d3.select(".map-list-scrolling ul").selectAll(".map-list-scrolling-item")
			.data(_selectedOrgs)
			.enter()
			.append("li")
			.attr("class", "map-list-scrolling-item")
			.text(function (d) {
				return d.name;
			})
			.on("click", function (d) {
				toOrgPanel(d);
			})
	}

	function toOrgPanel(_org) {
		$('.map-list').transition({ x:"100%" }, 500, "easeOutQuart");
		// $('.org-panel-map').transition({ y:0 });
		APP.ui.openOrgPanel(_org, true); //more than one org, go to orgList
	}

	function deleteOrgListItems() {
    d3.selectAll(".map-list-scrolling .map-list-scrolling-item").remove();
  }

}