function InfoPanel() {
	var self = this;
	self.create = createLegend;
	self.delete = deleteLegend;

	function createLegend(state) {
		switch(state){
			case "map":
				var frag = $("<li><div class='legend-dot org-color'></div><div class='legend-text'>Organisations</div></li>");
				$("#info-map .legenda ul").get(0).append(frag.get(0));
			break;
			case "network":
				createNetworkStats()
			break;
			case "cluster":
				var subdivideField = APP.cluster.subdivide_field;
				if (subdivideField != "none") {
					var subdivideData = APP.dataset.fields[APP.cluster.subdivide_field];
					var fieldColorScale = APP.getColorScale(APP.cluster.subdivide_field);
				} else var subdivideData = [{name: "Projects", color: "#ffad69"}]
				var item = d3.select("#info-cluster .legenda ul").selectAll(".legenda-item")
					.data(subdivideData)
					.enter()
					.append("li")
						.attr("class", "legenda-item")
				item.append("div")
					.attr("class", "legend-dot")
					.style("background", function(d){
						if (subdivideField != "none") {
							return fieldColorScale(d.name);
						} else return d.color;
					})
				item.append("div")
					.attr("class", "legend-text")
					.text(function(d) {
						return d.name;
					})
			break;
			default:

			break;
		}
	}

	function createNetworkStats() {
		var connections = APP.dataset.getNetworkStats();
		var orgConnRatio = Math.round((connections.totalLinkedOrgs/APP.dataset.orgs.length)*100);
		var prjShareRatio = Math.round((connections.totalSharedPrjs/APP.dataset.prjs.length)*100);
		$(".network-stats-orgs .stats-caption span").html(orgConnRatio+"%");
		$(".network-stats-orgs .stats-paragraph").html(orgConnRatio+"% of organisations in the DSI network are connected to at least one other organisation in the network.");
		$(".network-stats-orgs .stats-bar .color").transition({width: orgConnRatio+"%"}, 2000);
		$(".network-stats-prjs .stats-caption span").html(prjShareRatio+"%");
		$(".network-stats-prjs .stats-paragraph").html(prjShareRatio+"% of projects are linked to two or more organisations in the network.");
		$(".network-stats-prjs .stats-bar .color").transition({width: prjShareRatio+"%"}, 2000);
	}

	function deleteLegend(state) {
		d3.selectAll("#info-"+APP.state+" .legenda ul li").remove();
	}

}