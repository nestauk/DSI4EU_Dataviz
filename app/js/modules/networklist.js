function NetworkList() {
	var self = this;
	self.fillList = fillList;
	self.deleteNetworkListItems = deleteNetworkListItems;

	function fillList(selectedOrg) {
		var selectedNetwork = selectedOrg.linked_orgs;
		
		var totLinkedPrjs;
		totLinkedPrjs = d3.sum(selectedNetwork, function (e) {
			return e.shared_prjs.length;
		})
		$(".network-list-subtitle").text(selectedNetwork.length+" Organisations, "+totLinkedPrjs+" Projects");

		var items = d3.select(".network-list-scrolling ul").selectAll(".network-list-item")
			.data(selectedNetwork)
				.enter()
				.append("li")
					.attr("class", "network-list-item")

		var circleContainer = items.append("div")
			.attr("class", "networklist-circle-container")

		circleContainer
			.append("div")
				.attr("class", "networklist-panel-circle")

		$(".networklist-panel-circle").height($(".networklist-panel-circle").width())

		var itemParagraphs = items.append("div")
			.attr("class", "networklist-text-container")
			.on("click", function (d) {
				toNetworkPanel(d);
			})

		itemParagraphs.append("p")
			.text(function (d) {
				return d.name;
			})

		itemParagraphs.append("p")
			.text(function (d) {
				return "Works with "+d.linked_orgs.length+" Organisations on "+d.shared_prjs.length+" projects";
			})

		function toNetworkPanel(_org) {
			$('.network-list').transition({ y:"100%" });
			$('.network-panel').transition({ y:0 });
			APP.ui.openNetworkPanel(_org);
		}



	}


	function deleteNetworkListItems() {
		d3.select(".network-list-scrolling ul").selectAll("li").remove();
	}

}