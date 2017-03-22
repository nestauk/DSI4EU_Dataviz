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
	var scale = 1;
	var translateX = 0, lastX = false;
	var translateY = 0, lastY = false;
	var dragging = false;

	var minScale = .5
	var maxScale = 2
	var scaleFactor = .1;


	function createNetwork() {
		deleteNetwork()
		APP.filter.registerViewUpdate(createNetwork);
		width = $("#main-view").width(),
			height = $("#main-view").height();

		var orgs = _.filter(APP.filter.orgs, function(o) {
			return !_.isEmpty(o.linked_prjs) && _.some(o.linked_prjs, function(p) {
				return _.includes(APP.filter.prjs, p)
			})
		});
		var prjs = _.filter(APP.filter.prjs, function(p) {
			return !_.isEmpty(p.linked_orgs) && _.some(p.linked_orgs, function(o) {
				return _.includes(APP.filter.orgs, o)
			})
		});

		if(self.showLinkedOnly){ 
			prjs = _.filter(prjs, function(p){
				return p.linked_orgs.length > 1;
			})
			orgs = _.filter(orgs, function(o){
				return !_.isEmpty(o.shared_prjs);
			})
		}

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
			hexStr = intToHex(i)
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

		if(window.devicePixelRatio > 1) {
			scaleCanvas(canvas)
		}

		canvas.click(function(e) {
			var rgb = lc.getImageData(e.pageX, e.pageY, 1, 1).data
			hex = rgbToHex(rgb)
			var node = lookupMap[hex]
			if(node.type == 'org') APP.ui.openNetworkList(node);
			console.log(node.name, node.type, node.linked_orgs)
		})

		canvas.mousewheel(function(e){
			var delta = (e.deltaY / Math.abs(e.deltaY))*scaleFactor
			if(scale+delta > minScale && scale+delta < maxScale){
				scale += delta;
				var mx = e.pageX - translateX/scale
				var my = e.pageY - translateY/scale
				offsetX = -(mx * delta);
				offsetY = -(my * delta);
				translateX += offsetX
				translateY += offsetY
				update()
			}
		})

		$(document).on("mousedown touchstart", function(e){
			dragging = true;
			lastX = e.pageX || e.touches[0].pageX
			lastY = e.pageY || e.touches[0].pageY
		})

		$(document).on("mousemove touchmove", function(e){
			if(dragging){
				var x = e.pageX || e.touches[0].pageX;
				var y = e.pageY || e.touches[0].pageY;
				translateX += x - lastX
				translateY += y - lastY
				lastX = x;
				lastY = y;
				update()
			}
		})

		$(document).on("mouseup touchend", function(e){
			dragging = false;
		})

		function update() {
			var r = 6;
			updateLookup(r)

			c.save();
			c.clearRect(0, 0, width,  height);
			c.scale(scale, scale)
			c.translate(translateX/scale, translateY/scale)

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
			lc.translate(translateX/scale, translateY/scale)

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

	function drawNetwork() {
		self.system.on("tick", update);
		var svg = d3.select("#main-view").append("svg")
			.attr("id", "networkSvg")
			.attr("width", width)
			.attr("height", height);

		var link = svg.selectAll(".link"),
			node = svg.selectAll(".node");

		link = link
			.data(links)
			.enter().append("line")
			.attr("class", "link");
		node = node
			.data(nodes)
			.enter().append("circle")
			.attr("class", function(d) {
				return 'network-' + d.type;
			})
			.attr("r", function(d) {
				if (d.type === 'prj') return 3;
				else return 4;
			})

		function update() {
			link.attr("x1", function(d) {
					return d.source.x;
				})
				.attr("y1", function(d) {
					return d.source.y;
				})
				.attr("x2", function(d) {
					return d.target.x;
				})
				.attr("y2", function(d) {
					return d.target.y;
				})
			node.attr("cx", function(d) {
					return d.x;
				})
				.attr("cy", function(d) {
					return d.y;
				})
		}
	}

	function deleteNetwork() {
		self.system = null;
		$("#network-container").remove();
	}

}