function NetworkView() {
	var self = this;
	self.create = createNetwork;
	self.delete = deleteNetwork;

	self.showLinkedOnly = false;

	self.system = null;

	var nodes = null;
	var links = null;
	var width = 0,
		height = 0;

	var lookupMap = {};
	var translateX = 0,
		lastX = false;
	var translateY = 0,
		lastY = false;
	var dragging = false;

	var minScale = .5
	var maxScale = 2
	var scaleFactor = .1;
	var scale = initialScale = 1;

	function createNetwork() {
		resetTransforms()
		deleteNetwork()
		lookupMap = {};
		APP.ui.updateViewFunction = createNetwork;

		width = $("#main-view").width();
		height = $("#main-view").height();

		if (self.showLinkedOnly) {
			var prjs = _.filter(APP.filter.prjs, function(p) {
				return p.linked_orgs.length > 1;
			})
			var orgs = _.filter(APP.filter.orgs, function(o) {
				return !_.isEmpty(o.shared_prjs);
			})
		} else {
			var orgs = APP.filter.orgs
			var prjs = APP.filter.prjs
		}


		orgs = _.filter(orgs, function(o) {
			return !_.isEmpty(o.linked_prjs) && _.some(o.linked_prjs, function(p) {
				if (self.showLinkedOnly) return _.includes(APP.filter.prjs, p) && p.linked_orgs.length > 1;
				return _.includes(APP.filter.prjs, p);
			})
		});
		prjs = _.filter(prjs, function(p) {
			return !_.isEmpty(p.linked_orgs) && _.some(p.linked_orgs, function(o) {
				if (self.showLinkedOnly) return _.includes(APP.filter.orgs, o) && !_.isEmpty(o.shared_prjs);
				return _.includes(APP.filter.orgs, o);
			})
		});


		links = []
		nodes = orgs.concat(prjs)

		orgs.forEach(function(o) {
			o.linked_prjs.forEach(function(p) {
				if (_.includes(prjs, p)) {
					links.push({
						source: o,
						target: p
					})
				}
			})
		})

		self.system = d3.forceSimulation()
			.force("link", d3.forceLink().id(function(d) {
				return d;
			}).strength(2))
			.force("charge", d3.forceManyBody().strength(-150).distanceMax(100))
			.force("center", d3.forceCenter(width / 2, height / 2))

		self.system.nodes(nodes);

		self.system.force("link").links(links);

		nodes.forEach(function(n, i) {
			hexStr = intToHex(i + 1)
			lookupMap[hexStr] = n;
			n.hex = hexStr
		})

		drawCanvasNetwork()
	}

	function drawCanvasNetwork() {
		self.system.on("tick", update);

		var canvas = $("<canvas></canvas>")
			.attr("width", width)
			.attr("height", height)
			.css({
				width: width,
				height: height
			})
			.attr("id", "network-container")

		$("#main-view").append(canvas)
		var c = canvas[0].getContext("2d");
		var lookupCanvas = canvas.clone()
			.attr("id", "network-lookup")
			.css({
				position: 'absolute',
				top: 0,
				left: 0,
				'pointer-events': 'none',
				display: 'none'
			})
		var lc = lookupCanvas[0].getContext("2d");

		$("#main-view").append(lookupCanvas)

		if (window.devicePixelRatio > 1) {
			scaleCanvas(canvas)
		}

		var zoom = d3.zoom()
			.scaleExtent([0.35, 7])
			.translateExtent([
				[-1600, -1500],
				[1600, 1500]
			])
			.on("zoom", zoomCanvas)

		var zoomable = d3.select(canvas[0])
		zoomable.call(zoom)
		if (!window.isMobile) {
			zoomable.call(zoom.translateBy, 250, 0)
			zoomable.call(zoom.scaleBy, .6)
		}

		canvas.click(function(e) {
			var rgb = lc.getImageData(e.pageX, e.pageY, 1, 1).data
			hex = rgbToHex(rgb)
			if (hex != '#000000') var node = lookupMap[hex]
			if (node && node.type == 'org') APP.ui.openNetworkList(node);
		})

		function zoomCanvas() {
			var transform = d3.event.transform;
			scale = transform.k
			translateX = transform.x
			translateY = transform.y
			update()
		}

		function update() {
			var r = 6;
			updateLookup(r)

			c.save();
			c.clearRect(0, 0, width, height);
			c.scale(scale, scale)
			c.translate(translateX / scale, translateY / scale)

			links.forEach(function(d) {
				c.strokeStyle = "lightgrey";
				c.lineWidth = 1;
				c.beginPath();
				c.moveTo(d.source.x, d.source.y);
				c.lineTo(d.target.x, d.target.y);
				c.stroke();
			});

			nodes.forEach(function(d) {
				if (d.type === 'prj') {
					r = 4
					c.fillStyle = "salmon";
				} else {
					c.fillStyle = "steelblue";
				}
				c.beginPath();
				c.moveTo(d.x + r, d.y);
				c.arc(d.x, d.y, r, 0, 2 * Math.PI);
				c.fill();
			});

			c.restore();
		}

		function updateLookup(r) {
			lc.save();
			lc.clearRect(0, 0, width, height);
			lc.scale(scale, scale)
			lc.translate(translateX / scale, translateY / scale)

			nodes.forEach(function(d, i) {
				lc.fillStyle = d.hex;
				lc.beginPath();
				lc.moveTo(d.x + r, d.y);
				lc.arc(d.x, d.y, r, 0, 2 * Math.PI);
				lc.fill();
			});

			lc.restore();
		}
	}

	function scaleCanvas(canvas) {
		canvas.attr("width", width * window.devicePixelRatio)
		canvas.attr("height", height * window.devicePixelRatio)
		canvas[0].getContext("2d").scale(window.devicePixelRatio, window.devicePixelRatio)
	}

	function resetTransforms() {
		translateX = 0;
		translateY = 0;
		scale = initialScale;
	}

	function deleteNetwork() {
		resetNodes(nodes)
		resetNodes(links)
		nodes = []
		links = []
		if (self.system) {
			self.system.nodes(nodes);
			self.system.force("link").links(links);
			self.system = null;
		}
		$("#network-container").remove();
		$("#network-lookup").remove();
		lookupMap = null;
		$(document).off();
	}

	function resetNodes(array) {
		if (array && !_.isEmpty(array)) {
			array.forEach(function(n, i) {
				delete array[i].vx
				delete array[i].vy
				delete array[i].x
				delete array[i].y
			})
		}
	}

}