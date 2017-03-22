function NetworkList() {
	var self = this;
	self.fillList = fillList;
	self.deleteNetworkListItems = deleteNetworkListItems;

	function fillList(selectedOrg) {

		var network = getNetwork(selectedOrg);	
		$(".network-list-subtitle").text(network.orgs.length+" Organisations, "+network.prjs.length+" shared projects");

		var items = d3.select(".network-list-scrolling ul").selectAll(".network-list-item")
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

		function toNetworkPanel(org) {
			$('.network-list').transition({ y:"100%" });
			$('.network-panel').transition({ y:0 });
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
		d3.select(".network-list-scrolling ul").selectAll("li").remove();
	}

}