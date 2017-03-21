function ClusterPanel() {
	var self = this;
	self.fillHeader = fillHeader;
	self.drawPanel = drawPanel;
	self.deleteClusterPanelItems = deleteClusterPanelItems;

	function fillHeader(selectedCluster) {
		var prjCounts = d3.sum(selectedCluster.values, function (d) {
			return d.values.length;
		})
		$(".cluster-panel-container h2").html(selectedCluster.key);
		$(".cluster-panel-container .cluster-subtitle").html(prjCounts+" projects");
	}

	function drawPanel(selectedCluster) {

		var items = d3.select(".cluster-panel-container .cluster-panel-scrolling ul").selectAll(".cluster-item")
			.data(selectedCluster.values)
			.enter()
			.append("li")
			.attr("class", "cluster-item")			

		items.append("div")
			.attr("class", "cluster-panel-circle")
			.style("width", function(d){
				return d.values.length+"px";
			})
			.style("height", function(d){
				return d.values.length+"px";
			})

		items.append("span")
			.text(function (d) {
				return d.key+": "+d.values.length;
			})
			.each(generatePrjList)
			.on("click", clusterItemDetail)

		function clusterItemDetail() {
			$(".cluster-panel-scrolling .sub-list").toggleClass("invisible");
		}

		function generatePrjList(e, i) {
			d3.select(this).append("ul")
				.attr("class", "sub-list invisible")
					.selectAll("sub-list-items")
					.data(e.values)
					.enter()
					.append("li")
						.attr("class", "sub-list-items")
						.text(function (f) {
							return f.name;
						})
		}

	}

	function deleteClusterPanelItems() {
		d3.select(".cluster-panel-container .cluster-panel-scrolling ul").selectAll("li").remove();
	}

}