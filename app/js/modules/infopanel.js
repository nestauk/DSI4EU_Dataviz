function InfoPanel() {
	var self = this;
	self.create = createLegend;
	self.delete = deleteLegend;

	function createLegend(state) {
		switch(state){
			case "map":
				var frag = $("<li><div class='legend-dot org-color'></div>Organisations</li>");
				$(".modal-panel.info-panel.map .info-container .legenda ul").get(0).append(frag.get(0));
			break;
			case "network":
				var frag1 = $("<li><div class='legend-dot org-color'></div>Organisations</li>");
				var frag2 = $("<li><div class='legend-dot prj-color'></div>Projects</li>");
				$(".modal-panel.info-panel.network .info-container .legenda ul").get(0).append(frag1.get(0));
				$(".modal-panel.info-panel.network .info-container .legenda ul").get(0).append(frag2.get(0));
			break;
			case "cluster":
				var subdivideField = APP.cluster.subdivide_field;
				if (subdivideField != "none") {
					var subdivideData = APP.dataset.fields[APP.cluster.subdivide_field];
					var fieldColorScale = APP.getColorScale(APP.cluster.subdivide_field);
				} else var subdivideData = [{name: "Projects", color: "#ffad69"}]
				var item = d3.select(".modal-panel.info-panel.cluster .info-container .legenda ul").selectAll(".legenda-item")
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

	function deleteLegend(state) {
		d3.selectAll(".modal-panel.info-panel."+state+" .info-container .legenda ul li").remove();
	}

}