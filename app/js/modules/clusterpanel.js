function ClusterPanel() {
	var self = this;
	self.fillHeader = fillHeader;
	self.drawPanel = drawPanel;

	function fillHeader(_selectedCluster) {
		// var selectedData = APP.cluster.packdata.filter(function (d) {
		// 	return d.name == "United Kingdom";
		// })
		console.log(_selectedCluster)
		var prjCounts = d3.sum(_selectedCluster.values, function (d) {
			return d.values.length;
		})
		$(".cluster-panel-container h2").html(_selectedCluster.key);
		$(".cluster-panel-container .cluster-subtitle").html(prjCounts+" projects");
	}

	function drawPanel(_selectedCluster) {
		// _selectedCluster.children.forEach(function (d) {
		// 	console.log(d)
		// 	var el = $(".cluster-panel-container .cluster-panel-scrolling ul").append("li")
		// 	el.html(d.name+", "+d.size)
		// })
		d3.select(".cluster-panel-container .cluster-panel-scrolling ul").selectAll("li")
			.data(_selectedCluster.values)
			.enter()
			.append("li")
			.html(function (d) {
				return "<strong>"+d.key+"</strong>: "+d.values.length;
			})
	}

}