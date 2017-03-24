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
	var maxSubdivisionSum = 0;

	self.cluster_field = 'countries';
	self.subdivide_field = 'focus';

	var validCountries = ["Albania", "Andorra", "Austria", "Belgium", "Bosnia and Herzegovina", "Bulgaria", "Croatia", "Cyprus", "Czech Republic", "Denmark", "Estonia", "Finland", "France", "Germany", "Greece", "Hungary", "Iceland", "Ireland", "Italy", "Latvia", "Liechtenstein", "Lithuania", "Luxembourg", "Macedonia", "Malta", "Moldova", "Montenegro", "Netherlands", "Norway", "Poland", "Portugal", "Romania", "Serbia", "Slovakia", "Slovenia", "Spain", "Sweden", "Switzerland", "Ukraine", "United Kingdom"];

	function createNewClusters(clusterField, subdivideField) {
		if(clusterField) self.cluster_field = clusterField
		if(subdivideField) self.subdivide_field = subdivideField
		var cluster_field = self.cluster_field;
		var subdivide_field = self.subdivide_field;

		deleteCluster();

		APP.ui.updateViewFunction = createNewClusters;

		console.log('creating cluster', cluster_field, subdivide_field)

		projects = APP.filter.prjs;
		organisations = APP.filter.orgs;
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

		if (!subdivide_field || subdivide_field == 'none') {
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
			maxSubdivisionSum = _.sumBy(clusters, function(g) {
				var sum = _.sumBy(g.values, function(s) {
					return s.values.length
				})
				return sum;
			})
			maxSubdivisionValue = maxSubdivision.values[0].values.length;
			drawSubdividedClusters(subdivide_field);
		}
	}

	function createGroups(array, field) {
		var groups = [];
		fields[field].forEach(function(f) {
			var group = groupByFieldValue(array, field, f.name)
			if(!_.isEmpty(group.values)) groups.push(group)
		})
		groups.sort(function(a, b) {
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
		clusterElements = d3.select('#main-view').append("div")
			.attr("id", "cluster-container")
				.selectAll('svg')
				.data(clusters)
				.enter()
				.append('svg')
				.attr('width', clusterWidth)
				.attr('height', clusterHeight)
				.attr('class', 'cluster-svg')
				.append('g')
	}

	function drawSingleClusters() {
		var clusterScale = d3.scaleLinear()
			.domain([0, maxClusterValue])
			.range([0, clusterWidth / 3]);

		var clusterCircles = clusterElements
			.append('circle')
			.attr('r', function(d) {
				return clusterScale(d.values.length)
			})
			.attr("cx", clusterWidth / 2)
			.attr("cy", clusterHeight / 2)
			.attr("class", "circle prj")

		clusterElements.each(addLabel)
	}

	function drawSubdividedClusters(field) {
		var scaleSvg = d3.scaleLinear()
			.domain([0, maxSubdivisionSum])
			.range([1, 6]);

		var clusterScale = d3.scaleLinear()
			.domain([0, maxSubdivisionValue])
			.range([0, clusterWidth / scaleSvg(maxSubdivisionSum)]);

		var focusColorScale = APP.getColorScale('focus')
		var otherColorScale = APP.getColorScale(field);

		clusterElements.each(drawSubdivisions)
		clusterElements.each(addLabel)


		function drawSubdivisions(e, i) {
			var subdivisions = [];
			e.values.forEach(function(d) {
				d.r = clusterScale(d.values.length)
				subdivisions.push(d)
			})

			d3.packSiblings(subdivisions)
			var subs = d3.select(this)

			subs.on("click", function(d){
				APP.ui.openClusterPanel(d)
			})

			var circles = subs.selectAll('circle')
				.data(subdivisions)
				.enter()

			circles.append('circle')
				.attr('transform', function(d) {
					return "translate(" + (d.x + clusterWidth / 2) + "," + (d.y + clusterHeight / 2) + ")";
				})
				.attr("r", function(d) {
					return d.r
				})
				.style("fill", function(d) {
					if (field === "focus") {
						return focusColorScale(d.key);
					} else return otherColorScale(d.key);
				})
		}
	}

	function addLabel(e, i) {
		var clusterLabels = d3.select(this)
			.append('text')
			.attr("class", "cluster-label")
			.attr("x", clusterWidth / 2)
			.attr("y", clusterHeight - 30)
			.attr("text-anchor", "middle")
			.text(function(d) {
				return d.key
			})
	}

	function deleteCluster() {
		$(".cluster-svg").remove();
	}


}