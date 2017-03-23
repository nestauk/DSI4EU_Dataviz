function NetworkPanel() {
	var self = this;
	self.fillPanel = fillPanel;
	self.deleteNetworkPanelItems = deleteNetworkPanelItems;

	function fillPanel(selectedOrg) {
		//console.log(selectedOrg);

		$(".network-panel-title h2").text(selectedOrg.name);
		$(".network-panel-subtitle").text(selectedOrg.shared_prjs.length+" shared projects");

		selectedOrg.shared_prjs.forEach(function (o) {
			var list = $(".network-panel-scrolling ul").get(0)
			var li = $("<li></li>")
				.addClass("network-panel-item")
			list.append(li.get(0));

			var titleDiv = $("<div></div>")
				.addClass("network-panel-item-title")
				//.text(o.name)
			li.get(0).append(titleDiv.get(0));

			var titleLink = $("<a></a>")
				.attr("href", o.url)
				.attr("target", "_blank")
				.text(o.name)
			titleDiv.get(0).append(titleLink.get(0));

			var barDiv = $("<div></div>")
				.addClass("network-panel-item-bar")
				.css("width", o.linked_orgs.length+"rem")
			li.get(0).append(barDiv.get(0));

			var orgsDiv = $("<div></div>")
				.addClass("network-panel-item-org")
				.text(createOrgList(o))
			li.get(0).append(orgsDiv.get(0));
		})
		
		function createOrgList(d) {
			var orglist = "Shared with: ";
			d.linked_orgs.forEach(function (l, i) {
				if (l.name != selectedOrg.name) {
					orglist = orglist.concat(l.name);
					if (i != d.linked_orgs.length-1) orglist = orglist.concat(", ");
				}
			})
			return orglist;
		}

	}


	function deleteNetworkPanelItems() {
		d3.select(".network-panel-scrolling ul").selectAll("li").remove();
	}

}