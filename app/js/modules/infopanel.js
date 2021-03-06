function InfoPanel() {
	var self = this;
	self.create = createLegend;
	self.delete = deleteLegend;

	function createLegend(state) {
		switch(state){
			case "map":
				var frag = $("<li><div class='legend-dot org-color'></div><div class='legend-text'>Organisations</div></li>");
				$("#info-map .legenda ul").append(frag);
				createSizeLegend("map")
			break;
			case "network":
				createNetworkStats()
			break;
			case "cluster":
				createClusterLegend()
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

	function createClusterLegend() {
		var subdivideField = APP.cluster.subdivide_field;
		if (subdivideField != "none") {
			var subdivideData = APP.dataset.fields[APP.cluster.subdivide_field];
			var fieldColorScale = APP.getColorScale(APP.cluster.subdivide_field);
		} else var subdivideData = [{name: "Projects", color: "#f28244"}]
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
		if (subdivideField === "none") {
			createSizeLegend("cluster")
		}
	}

	function createSizeLegend(field) {
		var legendSizeContainer = d3.select("#info-"+APP.state+" .legenda").append("div")
			.attr("class", "legend-size-container")
		var dim = 50
		var offset = 4
		legendSizeContainer.append("div")
			.attr("class", "legend-svg")
			.append("svg")
				.attr("width", dim)
				.attr("height", dim)
					.selectAll(".legend-circle")
						.data([
							{ id: 0, y: dim/2 + dim/4 + dim/8 - offset/2, radius: dim/8 - offset/8 },
							{ id: 1, y: dim/2 + dim/4 - offset/2, radius: dim/4 - offset/4 },
							{ id: 2, y: dim/2, radius: dim/2 - offset/2 }
						])
						.enter()
						.append("circle")
							.attr("class", function () {
								return field==="cluster"
								? "legend-circle cluster"
								: "legend-circle map"
							})
							.attr("cx", dim/2)
							.attr("cy", function (d) {
								return d.y;
							})
							.attr("r", function (d) {
								return 0;
							})
							.transition()
							.duration(500)
							.delay(500)
							.attr("r", function (d) {
								return d.radius;
							})		
		legendSizeContainer.append("div")
			.attr("class", "legenda-size-item")
			.text(function () {
				return field==="cluster"
				? "Number of projects"
				: "Number of organisations in the same location"
			})
		$(".legenda-size-item").transition({opacity: 1, delay: 750}, 500)
	}

	function deleteLegend(state) {
		d3.selectAll("#info-"+APP.state+" .legenda ul li").remove();
		d3.select("#info-"+APP.state+" .legend-size-container").remove()
	}

}