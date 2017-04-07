function ClusterView() {
	var self = this;
	self.create = createNewClusters;
	self.delete = deleteCluster;
	self.update = createNewClusters;
	self.focus = focusSearchResult;
	self.getClusters = getCurrentClusters;

	var width, height, clusterWidth, clusterHeight, clusterElements, clusterWrappers;
	var projects;
	var organisations;
	var fields;
	var clusters = [];
	var maxClusterValue = 0;
	var maxSubdivisionValue = 0;
	var maxSubdivisionSum = 0;
	var container;

	self.cluster_field = 'countries';
	self.subdivide_field = 'none';

	var validCountries = ["Albania", "Andorra", "Austria", "Belgium", "Bosnia and Herzegovina", "Bulgaria", "Croatia", "Cyprus", "Czech Republic", "Denmark", "Estonia", "Finland", "France", "Germany", "Greece", "Hungary", "Iceland", "Ireland", "Italy", "Latvia", "Liechtenstein", "Lithuania", "Luxembourg", "Macedonia", "Malta", "Moldova", "Montenegro", "Netherlands", "Norway", "Poland", "Portugal", "Romania", "Serbia", "Slovakia", "Slovenia", "Spain", "Sweden", "Switzerland", "Ukraine", "United Kingdom"];

	function createNewClusters() {
		var cluster_field = self.cluster_field;
		var subdivide_field = self.subdivide_field;
		deleteCluster();

		$(window).on("resize", function () {
			if(!window.isMobile && !APP.embed && orientMQ.matches) $("#cluster-container").outerWidth($("#main-view").outerWidth() - $('.ui header').outerWidth());
			else $("#cluster-container").outerWidth($("#main-view").outerWidth())
		})

		projects = APP.filter.prjs;
		organisations = APP.filter.orgs;
		fields = APP.dataset.fields;

		container = d3.select('#main-view').append("div")
			.attr("id", "cluster-container")

		if(!window.isMobile && !APP.embed && orientMQ.matches) $("#cluster-container").outerWidth($("#main-view").outerWidth() - $('.ui header').outerWidth());
		else $("#cluster-container").outerWidth($("#main-view").outerWidth())
		width = $("#cluster-container").outerWidth();
		height = $("#main-view").height();
		clusterWidth = width / 2
		//clusterHeight = height / 2
		clusterHeight = clusterWidth
		if(!window.isMobile) clusterWidth = width/2.2

		clusters = createGroups(projects, cluster_field)

		if(cluster_field == 'countries'){
			clusters = clusters.filter(function(c){
				return _.includes(validCountries, c.key)
			})
		}

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
		clusterWrappers.on("click", function(d){
			APP.ui.openClusterPanel(d)
			$('#cluster-container .active').removeClass('active')
			$(this).addClass('active')
		})
	}

	function createGroups(array, field) {
		var groups = [];
		if(field != 'linked_orgs'){
		fields[field].forEach(function(f) {
			var group = groupByFieldValue(array, field, f.name)
			if(!_.isEmpty(group.values)) groups.push(group)
		})
		} else {
			groups = groupByOrg(array);
		}
		groups.sort(function(a, b) {
			return b.values.length - a.values.length
		})
		return groups;
	}

	function groupByFieldValue(array, field, value) {
		var records = {
			key: value,
			values: _.filter(array, function(d) {
				return _.some(d[field], function(f){
					if(_.isObject(f)) return f.name == value;
					else return f == value;
				})
			})
		}
		return records;
	}

	function groupByOrg(projects){
		var groups = []
		var orgs = APP.filter.orgs.filter(function(o){
			return !_.isEmpty(o.linked_prjs)
		})
		orgs.forEach(function(o){
			var group = {
				key: o.name,
				values: _.intersection(o.linked_prjs, projects)
			}
			groups.push(group)
		})
		return groups;
	}

	function drawClusterElements() {
		clusterWrappers = container
				.selectAll('div')
				.data(clusters)
				.enter()
				.append('div')
				.attr("class", "cluster-wrapper")
				.attr("id", function(d){
					d.elementId = 'cluster-'+idEncode(d.key)
					return d.elementId
				})

		clusterElements = clusterWrappers
				.append('svg')
				// .attr('width', clusterWidth)
				// .attr('height', clusterHeight)
				.attr("viewBox", "0 0 " + clusterWidth + " " + clusterHeight)
				.attr('class', 'cluster-svg')
				.append('g')
	}

	function drawSingleClusters() {
		var clusterScale = d3.scaleLinear()
			.domain([0, maxClusterValue])
			.range([2, clusterWidth / 3]);

		var clusterCircles = clusterElements
			.append('circle')
			.attr("cx", clusterWidth / 2)
			.attr("cy", clusterHeight / 2)
			.attr("class", "circle prj")
			.transition()
				.duration(500)
				.delay(400)
			.attr('r', function(d) {
				return clusterScale(d.values.length)
			})

		clusterWrappers.each(addLabel)
	}

	function drawSubdividedClusters(field) {
		var scaleSvg = d3.scaleLinear()
			.domain([0, maxSubdivisionSum])
			.range([1, 6]);

		var clusterScale = d3.scaleLinear()
			.domain([0, maxSubdivisionValue])
			.range([3, clusterWidth / scaleSvg(maxSubdivisionSum)]);

		var circleScale = APP.getColorScale(field)

		clusterElements.each(drawSubdivisions)
		clusterWrappers.each(addLabel)


		function drawSubdivisions(e, i) {
			var subdivisions = [];
			e.values.forEach(function(d) {
				d.r = clusterScale(d.values.length)
				subdivisions.push(d)
			})

			d3.packSiblings(subdivisions)
			var subs = d3.select(this)

			var circles = subs.selectAll('circle')
				.data(subdivisions)
				.enter()

			circles.append('circle')
				.attr('transform', function(d) {
					return "translate(" + (d.x + clusterWidth / 2) + "," + (d.y + clusterHeight / 2) + ")";
				})
				.style("fill", function(d) {
					return circleScale(d.key);
				})
				.transition()
				.duration(500)
				.delay(400)
				.attr("r", function(d) {
					return d.r
				})
		}
	}

	function focusSearchResult(result){
		$('#cluster-container').scrollTo('#'+result.elementId, {duration:500})
		$('#cluster-container .active').removeClass('active')
		$('#'+result.elementId).addClass('active');
	}

	function getCurrentClusters(){
		return clusters;
	}

	function addLabel(e, i) {
		var clusterLabels = d3.select(this)
			.append('p')
			.attr("class", "cluster-label")
			.append('span')
			.text(function(d) {
				return d.key
			})
	}

	function deleteCluster() {
		$("#cluster-container").remove();
	}


}