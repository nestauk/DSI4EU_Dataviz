function NetworkPanel() {
	var self = this;
	self.fillPanel = fillPanel;
	self.deleteNetworkPanelItems = deleteNetworkPanelItems;

	function fillPanel(selectedOrg) {
		//console.log(selectedOrg);

		$(".network-panel-title h2").text(selectedOrg.name);
		$(".network-panel-subtitle").text(selectedOrg.shared_prjs.length+" shared projects");

		selectedOrg.linked_orgs.forEach(function (f) {
			f.matchingSharedPrjs = _.intersectionBy(f.shared_prjs, selectedOrg.shared_prjs, "id");
		})

		var items = d3.select(".network-panel-scrolling ul").selectAll(".network-panel-item")
			.data(selectedOrg.linked_orgs)
				.enter()
				.append("li")
					.attr("class", "network-panel-item")

		items.append("div")
			.attr("class", "network-panel-item-title")
			.text(function (d) {
				return d.name;
			})

		items.append("div")
			.attr("class", "network-panel-item-bar")
			.style("width", function (d) {
				return d.matchingSharedPrjs.length+"rem";
			})

		items
			.each(generatePrjList)
			.on("click", viewPrjList)
		
		function viewPrjList() {
			if (d3.event.target == this || d3.event.target.parentNode == this) {
				$(this).find("ul").toggleClass("invisible");
			}
		}

		function generatePrjList(e, i) {
			d3.select(this).append("ul")
				.attr("class", "sub-list invisible")
					.selectAll("sub-list-items")
					.data(e.matchingSharedPrjs)
					.enter()
					.append("li")
						.attr("class", "sub-list-items")
						.append("a")
							.attr("href", function (d) {
								return d.url;
							})
							.attr("target", "_blank")
							.text(function (f) {
								return f.name;
							})
		}

	}


	function deleteNetworkPanelItems() {
		d3.select(".network-panel-scrolling ul").selectAll("li").remove();
	}

}