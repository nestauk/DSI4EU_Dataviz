function NetworkList() {
	var self = this;
	self.create = fillList;
	self.delete = deleteNetworkListItems;

	function fillList(org) {

		var network = getNetwork(org);	
		$(".subtitle").text(network.orgs.length+_.pluralize(" Organisation", network.orgs.length)+", "+network.prjs.length+_.pluralize(" shared project", network.prjs.length));

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
				return "Works with "+d.linked_orgs.length+" Organisation"+plurOrSing(d.linked_orgs)+" on "+d.shared_prjs.length+" project"+plurOrSing(d.shared_prjs);
			})

		function toNetworkPanel(org) {
			$('.network-list').transition({ x:"100%" }, 500, "easeOutQuart");
			APP.ui.openNetworkPanel(org);
		}
	}

	function getNetwork(org){
		var network_orgs = []
		var network_prjs = []
		network_orgs.push(org)

		getOrgNetwork(org)
		function getOrgNetwork(org){
			var prjs = _.difference(org.shared_prjs, network_prjs);
			network_prjs = network_prjs.concat(prjs)
				prjs.forEach(function(p){
					var orgs = _.difference(p.linked_orgs, network_orgs);
					network_orgs = network_orgs.concat(orgs)
						orgs.forEach(function(o){
							getOrgNetwork(o)
						})
				})
		}
		return {
			prjs: network_prjs,
			orgs: network_orgs
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