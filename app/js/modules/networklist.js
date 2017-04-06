function NetworkList() {
	var self = this;
	self.create = fillList;
	self.delete = deleteNetworkListItems;

	function fillList(org) {

		var network = APP.dataset.getNetworkData(org);	
		$(".subtitle").text(network.orgs.length+_.pluralize(" Organisation", network.orgs.length)+", "+network.prjs.length+_.pluralize(" shared project", network.prjs.length));
		
		network.orgs.sort(function (a, b) {
			return b.linked_orgs.length - a.linked_orgs.length;
		})

		var items = d3.select(".network-list-container .scrolling ul").selectAll(".network-list-item")
			.data(network.orgs)
				.enter()
				.append("li")
					.attr("class", "network-list-item")

		var circleContainer = items.append("div")
			.attr("class", "networklist-circle-container")

		circleContainer
			.append("div")
				.attr("class", "networklist-panel-circle")

		$(".networklist-panel-circle").height($(".networklist-panel-circle").width())
		$(".networklist-panel-circle").transition({ scale: 1.2, delay: 500 }, 500, "easeOutQuint");

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
				return "Works with "+d.linked_orgs.length+_.pluralize(" Organisation", d.linked_orgs.length)+" on "+d.shared_prjs.length+_.pluralize(" project", d.shared_prjs.length);
			})

		function toNetworkPanel(org) {
			$('.network-list').transition({ x:"-100%" }, 750, "easeInOutQuint");
			APP.ui.openNetworkPanel(org);
		}
	}

	function flattenNetwork(network){
		var flatten = _.map(network, function(n){
			return n.type+' - '+n.name
		})
		return flatten;
	}

	function deleteNetworkListItems() {
		d3.select(".network-list-container .scrolling ul").selectAll("li").remove();
	}

}