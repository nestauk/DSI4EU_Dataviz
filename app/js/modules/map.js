function MapView() {
	var self = this;
	self.create = createMap;
	self.delete = deleteMap;
	self.focus = focusSearchResult;

	var zoomLevel = 1;
	var data;
	var map, path, projection;
	var countries;
	var maxCircleSize = 0;
	var width = 0
	var height = 0
	var current = 'countries'
	var container;
	var zoom;
	var orgs;
	var svg;
	var currentSearchResult = null;

	function createMap() {
		APP.ui.updateViewFunction = drawMap;
		width = $("#main-view").width();
		height = $("#main-view").height();

		var projectionCenter = [36, 64]
		var projectionScale = 500;

		projection = d3.geoMercator()
			.center(projectionCenter)
			.scale(projectionScale)

		path = d3.geoPath()
			.projection(projection);

		svg = d3.select("#main-view").append("svg")
			.attr("id", "map-container")
			.attr("width", width)
			.attr("height", height);

		map = svg.append("g")
			.attr("class", "map");

		countries = createCountries();
		createMapGeometry();

		zoom = d3.zoom()
			.scaleExtent([0.35, 10])
			.translateExtent([
				[-1500, -500],
				[1500, 1500]
			])
			.on("zoom", zoomMap)

		svg.call(zoom)

		if (!window.isMobile) {
			var t = d3.zoomIdentity.translate(400, -100).scale(1.1);
			svg.call(zoom.transform, t)
		}

		container = map.append("g")
			.attr("id", "dots")
		drawMap()
	}

	function drawMap() {
		data = prepareData()
		createMapContent();
	}

	function createCountries() {
		countries = []
		APP.dataset.fields.countries.forEach(function(c) {
			var country_orgs = _.filter(APP.filter.orgs, function(o) {
				return o.country == c.name
			})
			countries.push({
				name: c.name,
				orgs: country_orgs
			})
		})
		return countries;
	}

	function createMapGeometry() {
		var topology = APP.dataset.maptopo;
		var states = topojson.feature(topology, topology.objects.countries).features;

		var countryPaths = map.append("g")
			.attr("id", "states")
			.selectAll("path")
			.data(states)
			.enter().append("path")
			.attr("d", path)
			.attr("id", function(d) {
				return d.id;
			})

		getCountryCentroids(countryPaths)

		map.append("path")
			.datum(topojson.mesh(topology, topology.objects.countries, function(a, b) {
				return a !== b;
			}))
			.attr("id", "state-borders")
			.attr("d", path)

		svg.on("click", function(d) {
			if (currentSearchResult) {
				currentSearchResult = null;
				map.selectAll(".active")
					.classed("active", false)
			}
		})
	}

	function getCountryCentroids(countryPaths) {
		countryPaths.each(function(d) {
			var centroid = path.centroid(d);
			var country = _.find(countries, function(c) {
				if (!d.properties) return false;
				else return d.properties.name == c.name
			})
			if (country) {
				country.cx = centroid[0]
				country.cy = centroid[1]
			}
		})
	}

	function createMapContent() {
		var countryScale = d3.scaleLinear()
			.domain([0, maxCircleSize])
			.range([2, 50]);
		var opacityScale = d3.scaleLinear()
			.domain([0, maxCircleSize])
			.range([.8, .3]);

		var circle = container
			.selectAll("circle")
			.data(data, function(d) {
				return d.name
			})

		circle
			.exit()
			.transition()
			.delay(function(d, i) {
				return 2 + i
			})
			.duration(400)
			.attr("r", 0)
			.remove()

		circle
			.enter()
			.append("circle")
			.merge(circle)
			.on("click", function(d) {
				if (d.orgs.includes(currentSearchResult))	APP.ui.openMapPanel(currentSearchResult)
				else APP.ui.openMapPanel(d)
			})
			.attr("cx", function(d) {
				return d.cx;
			})
			.attr("cy", function(d) {
				return d.cy;
			})
			.classed("active", function(d) {
				return d.orgs.includes(currentSearchResult);
			})
			.transition()
			.delay(function(d, i) {
				return 2 + i
			})
			.duration(400)
			.attr("r", function(d, i) {
				if (d.orgs && d.orgs.length > 1) return countryScale(d.orgs.length);
				else return 1;
			})
			.style("fill-opacity", function(d, i) {
				if (zoomLevel == 1 && d.orgs) return .6;
				else if (zoomLevel > 1.5 && d.orgs) return opacityScale(d.orgs.length);
				else if (zoomLevel > 1.5 && d.orgs.length <= 1) return 1;
				else return 0;
			})

	}

	function prepareData() {
		orgs = APP.filter.orgs.filter(function(d) {
			return _.isNumber(d.longitude) && _.isNumber(d.longitude) && _.some(APP.filter.prjs, function(p) {
				return _.includes(d.linked_prjs, p)
			});
		})

		var data;
		if (zoomLevel == 1) {
			data = countries
		} else {
			data = _.map(orgs, function(o) {
				var node = {
					name: o.name,
					cx: projection([o.longitude, o.latitude])[0],
					cy: projection([o.longitude, o.latitude])[1],
					orgs: [o]
				}
				return node;
			})
			data.forEach(function(d) {
				if (!d.duplicate) {
					var sameLocationNodes = _.filter(data, function(o) {
						return o != d && o.cx == d.cx && o.cy == d.cy
					})
					if (!_.isEmpty(sameLocationNodes)) {
						sameLocationOrgs = _.map(sameLocationNodes, function(l) {
							l.duplicate = true;
							return l.orgs[0];
						})
						d.orgs = d.orgs.concat(sameLocationOrgs);
						d.name = d.orgs[0].region || 'Multiple Orgs'
					}
				}
			})
			data = data.filter(function(n) {
				if (!n.duplicate) return true
			})
			data = data.sort(function(a, b) {
				return b.orgs.length - a.orgs.length
			})
		}
		maxCircleSize = data[0].orgs.length
		return data;
	}

	function focusSearchResult(org) {
		currentSearchResult = org;
		zoomLevel = 2;
		drawMap();
		var search_org = _.find(data, function(n) {
			return _.includes(n.orgs, org)
		})
		var scale = 3
		var w = width / 2
		if(!window.isMobile) w = (width - $('.ui header').width()/scale) / 2 + $('.ui header').width()/scale;
		var translate = [w - search_org.cx, height / 2 - search_org.cy]
		var t = d3.zoomIdentity.translate(translate[0], translate[1]);
		svg.transition().duration(500).call(zoom.transform, t).on("end", function() {
			svg.transition().call(zoom.scaleTo, scale)
		})
	}

	function zoomMap() {
		var transform = d3.event.transform
		if (transform.k > 1.5 && current != 'orgs') {
			current = 'orgs'
			zoomLevel = 2
			drawMap()
		} else if (transform.k < 1.5 && current != 'countries') {
			current = 'countries'
			zoomLevel = 1
			drawMap()
		}
		map.attr("transform", "translate(" + transform.x + "," + transform.y + ") scale(" + transform.k + ")");
	}

	function deleteMap() {
		$("#map-container").remove();
	}

}