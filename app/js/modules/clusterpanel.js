function ClusterPanel() {
	var self = this;
	self.fillHeader = fillHeader;
	self.drawPanel = drawPanel;

	function fillHeader(_selectedCluster) {
		var selectedData = APP.cluster.packdata.filter(function (d) {
			return d.name == "United Kingdom";
		})
		console.log(selectedData)
		var prjCounts = d3.sum(_selectedCluster.children, function (d) {
			return d.size;
		})
		$(".cluster-panel-container h2").html(_selectedCluster.name);
		$(".cluster-panel-container .cluster-subtitle").html(prjCounts+" projects");
	}

	function drawPanel(_selectedCluster) {
		// _selectedCluster.children.forEach(function (d) {
		// 	console.log(d)
		// 	var el = $(".cluster-panel-container .cluster-panel-scrolling ul").append("li")
		// 	el.html(d.name+", "+d.size)
		// })
		d3.select(".cluster-panel-container .cluster-panel-scrolling ul").selectAll("li")
			.data(_selectedCluster.children)
			.enter()
			.append("li")
			.text(function (d) {
				return d.name+": "+d.size;
			})
	}

}