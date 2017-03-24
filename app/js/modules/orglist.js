function OrgList() {
	var self = this;
	self.create = createList;
	self.delete = deleteOrgListItems;

	function createList(node){
		fillList(node);
	}

	function fillList(node) {
		d3.select(".org-list-map-container h3")
			.text(node.name)

		d3.select(".org-list ul").selectAll(".org-list-item")
			.data(node.orgs)
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

	function toOrgPanel(org) {
		$('.org-list-map').transition({ y:"100%" });
		$('.org-panel-map').transition({ y:0 });
		APP.ui.openOrgPanel(org, true); //more than one org, go to orgList
	}

	function deleteOrgListItems() {
    d3.selectAll(".map-list-scrolling .map-list-scrolling-item").remove();
  }

}