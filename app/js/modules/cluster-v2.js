function ClusterView() {
	var self = this;
	self.create = createNewClusters;
	self.delete = deleteCluster;


	var width, height, clusterWidth, clusterHeight, clusterElements;
	var projects;
	var organisations;
	var fields;
	var clusters = [];
	var maxClusterValue = 0;
	var maxSubdivisionValue = 0;

	function createNewClusters(cluster_field, subdivide_field) {
		projects = APP.dataset.prjs;
		organisations = APP.dataset.orgs;
		fields = APP.dataset.fields;

		width = $("#main-view").width();
		height = $("#main-view").height();

		clusterWidth = width / 2
		clusterHeight = height / 2

		clusters = createGroups(projects, cluster_field)
		maxClusterValue = _.maxBy(clusters, function(g) {
			return g.values.length
		}).values.length

		drawClusterElements();

		if (!subdivide_field) {
			drawSingleClusters()
		} else {
			clusters.forEach(function(c) {
				var subdivisions = createGroups(c.values, subdivide_field);
				c.values = subdivisions;
			})
			var maxSubdivision = _.maxBy(clusters, function(g) {
				return _.maxBy(g.values, function(s) {
					return s.values.length
				})
			})
			maxSubdivisionValue = maxSubdivision.values[0].values.length;
			drawSubdividedClusters();
		}
	}

	function createGroups(array, field) {
		var groups = [];
		fields[field].forEach(function(f) {
			var group = groupByFieldValue(array, field, f.name)
			groups.push(group)
		})
		groups.sort(function(a, b){
			return b.values.length - a.values.length
		})
		return groups;
	}

	function groupByFieldValue(array, field, value) {
		var records = {
			key: value,
			values: _.filter(array, function(d) {
				return _.includes(d[field], value)
			})
		}
		return records;
	}

	function drawClusterElements() {
		clusterElements = d3.select('#main-view')
			.selectAll('svg')
			.data(clusters)
			.enter()
			.append('svg')
			.attr('width', clusterWidth)
			.attr('height', clusterHeight)
			.append('g')
	}

	function drawSingleClusters() {
		var clusterScale = d3.scaleSqrt()
			.domain([1, maxClusterValue])
			.range([1, clusterWidth / 2]);

		var clusterCircles = clusterElements
			.append('circle')
			.attr('r', function(d) {
				return clusterScale(d.values.length)
			})
			.attr("cx", clusterWidth / 2)
			.attr("cy", clusterHeight / 2)

		var clusterLabels = clusterElements
			.append('text')
			.attr("class", "cluster-label")
			.attr("x", clusterWidth / 2)
			.attr("y", clusterHeight - 30)
			.attr("text-anchor", "middle")
			.text(function(d) {
				return d.key
			})
	}

	function drawSubdividedClusters(field) {
		var clusterScale = d3.scaleLinear()
			.domain([1, maxSubdivisionValue])
			.range([1, clusterWidth]);

		clusterElements.each(drawSubdivisions)

		function drawSubdivisions(e, i){
			var subdivisions = [];
			e.values.forEach(function(d){
				d.r = d.values.length
				subdivisions.push(d)
			})

			d3.packSiblings(subdivisions)
			var subs = d3.select(this).selectAll('circle')
			.data(subdivisions)
			.enter()
			.append('circle')
			.attr('transform', function (d){
			  return "translate(" + (d.x) + "," + (d.y) + ")"; 
			})
			.attr("r", function(d){
				return d.r
			})
			.style("fill", "rgba(0,0,0,0.3)")
		}



	}

	function deleteCluster() {
		$(".clusterSvg").remove();
	}


}