function InfoPanel() {
	var self = this;
	self.create = createLegend;
	self.delete = deleteLegend;

	function createLegend(state) {
		switch(state){
			case "map":
				var frag = $("<li><div class='legend-dot org-color'></div><div class='legend-text'>Organisations</div></li>");
				$(".info-panel.map .info-container .legenda ul").get(0).append(frag.get(0));
			break;
			case "network":
				// var frag1 = $("<li><div class='legend-dot org-color'></div><div class='legend-text'>Organisations</div></li>");
				// var frag2 = $("<li><div class='legend-dot prj-color'></div><div class='legend-text'>Projects</div></li>");
				// $(".info-panel.network .info-container .legenda ul").get(0).append(frag1.get(0));
				// $(".info-panel.network .info-container .legenda ul").get(0).append(frag2.get(0));
				createNetworkStats()
			break;
			case "cluster":
				var subdivideField = APP.cluster.subdivide_field;
				if (subdivideField != "none") {
					var subdivideData = APP.dataset.fields[APP.cluster.subdivide_field];
					var fieldColorScale = APP.getColorScale(APP.cluster.subdivide_field);
				} else var subdivideData = [{name: "Projects", color: "#ffad69"}]
				var item = d3.select(".info-panel.cluster .info-container .legenda ul").selectAll(".legenda-item")
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
		$(".network-stats-orgs .stats-caption").html("Networked organisations: "+orgConnRatio+"%");
		$(".network-stats-orgs .stats-paragraph").html(orgConnRatio+"% of organisations in the DSI network are connected to at least one other organisation in the network.");
		$(".network-stats-orgs .stats-bar .color").transition({width: orgConnRatio+"%"}, 2000);
		$(".network-stats-prjs .stats-caption").html("Collaborative projects: "+prjShareRatio+"%");
		$(".network-stats-prjs .stats-paragraph").html(prjShareRatio+"% of projects are linked to two or more organisations in the network.");
		$(".network-stats-prjs .stats-bar .color").transition({width: prjShareRatio+"%"}, 2000);
	}

	function deleteLegend(state) {
		d3.selectAll(".info-panel."+state+" .info-container .legenda ul li").remove();
	}

}