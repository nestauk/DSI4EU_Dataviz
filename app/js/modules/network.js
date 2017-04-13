function NetworkView() {
	var self = this;
	self.create = createNetwork;
	self.delete = deleteNetwork;
	self.focus = focusSearchResult;
	self.resetFocus = resetFocus;
	self.point = focusOnPoint;
	self.update = drawNetwork
	self.pause = pause
	self.restart = restart

	self.showLinkedOnly = true;

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
	var currentActiveNetwork = null;
	var currentResultFocus = null;
	var container, canvas, lookupCanvas, zoom, zoomable;
	var infoPopup;

	function createNetwork() {
		resetTransforms()
		deleteNetwork()
		lookupMap = {};

		width = $("#main-view").width();
		height = $("#main-view").height();
		
		$(window).on("resize", function () {
			if(!window.isMobile && !APP.embed && orientMQ.matches) width = $("#main-view").width() - $('.ui header').width()
			else width = $("#main-view").width()
			height = $("#main-view").height();
			updateCanvasSize();
		})

		if (!window.isMobile && !APP.embed && orientMQ.matches){
			width = width - $('.ui header').width();
		}

		self.system = d3.forceSimulation()
			.force("link", d3.forceLink().id(function(d) {
				return d;
			}).strength(2))
			.force("charge", d3.forceManyBody().strength(-150).distanceMax(100))
			.force("center", d3.forceCenter(width / 2, height / 2))

		container = $('<div id="network-wrapper"></div>');

		$("#main-view").append(container)

		canvas = $("<canvas></canvas>")
			.attr("width", width)
			.attr("height", height)
			// .css({
			// 	width: width,
			// 	height: height
			// })
			.attr("id", "network-container")

		lookupCanvas = canvas.clone()
			.attr("id", "network-lookup")
			.css({
				position: 'absolute',
				left: 0,
				top: 0,
				display: 'none',
				'pointer-events': 'none'
			})

		container.append(canvas, lookupCanvas)

		if (window.devicePixelRatio > 1) {
			scaleCanvas(canvas)
		}

		zoom = d3.zoom()
			.scaleExtent([0.35, 7])
			.translateExtent([
				[-1600, -1500],
				[1600, 1500]
			])
			.on("zoom", zoomCanvas)

		zoomable = d3.select(canvas[0])
		zoomable.call(zoom)

		canvas.click(function(e) {
			var lc = lookupCanvas[0].getContext("2d");
			if (infoPopup) removeInfoPopup();
			resetFocus()
			var rgb = lc.getImageData(e.offsetX, e.offsetY, 1, 1).data
			hex = rgbToHex(rgb)
			if (hex != '#000000') var node = lookupMap[hex]
			if (node) {
				focusSearchResult(node)
			}
			updateViewSettings();
			update();
		})

		drawNetwork();
	}

	function updateCanvasSize(){
		$('#network-wrapper canvas').attr('width', width)
		$('#network-wrapper canvas').attr('height', height)
		update()
		console.log(width, height)
	}

	function prepareData() {
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
	}

	function drawNetwork() {
		prepareData();
		self.system.nodes(nodes);
		self.system.force("link").links(links);

		nodes.forEach(function(n, i) {
			hexStr = intToHex(10 * i)
			lookupMap[hexStr] = n;
			n.hex = hexStr
		})
		self.system.on("tick", update);
		restart();
	}

	function zoomCanvas() {
		if (infoPopup) removeInfoPopup();
		var transform = d3.event.transform;
		scale = transform.k
		translateX = transform.x
		translateY = transform.y
		update()
	}

	function update() {
		var r = 6;
		var c = canvas[0].getContext("2d");
		var lc = lookupCanvas[0].getContext("2d");
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
				c.fillStyle = "#f28244";
				if (currentActiveNetwork && !_.includes(currentActiveNetwork.prjs, d)) c.fillStyle = '#f5d9ca'
			} else {
				c.fillStyle = "#b164a5";
				if (currentActiveNetwork && !_.includes(currentActiveNetwork.orgs, d)) c.fillStyle = '#e5d2e2'
			}
			if(currentResultFocus && currentResultFocus == d) c.fillStyle = '#1DC9A0'
			c.beginPath();
			c.moveTo(d.x + r, d.y);
			c.arc(d.x, d.y, r, 0, 2 * Math.PI);
			c.fill();
		});
		c.restore();

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

	function focusSearchResult(result) {
		currentActiveNetwork = APP.dataset.getNetworkData(result, true, true);
		currentResultFocus = result
		var scale = 3
		var translate = [width / 2 - result.x, height / 2 - result.y]
		var t = d3.zoomIdentity.translate(translate[0], translate[1]);
		zoomable.transition().duration(500).call(zoom.transform, t).on("end", function() {
			createInfoPopup(result);
		})
		updateViewSettings();
	}

	function focusOnPoint(transform) {
		var scale = transform.k
		var t = d3.zoomIdentity.translate(transform.x, transform.y);
		zoomable.transition().duration(500).call(zoom.transform, t);
	}

	function createInfoPopup(result) {
		if (currentActiveNetwork.orgs.length > 1 && !APP.embed) {
			infoPopup = $('<div class="network-popup"><h3 class="network-' + result.type + '">' + result.name + '</h3><p class="network-cta">See network</p></div>');
			infoPopup.click(function() {
				APP.ui.openNetworkList(result);
			})
		} else {
			infoPopup = $('<div class="network-popup"><h3 class="network-' + result.type + '">' + result.name + '</h3></div>');
		}
		container.append(infoPopup)
		infoPopup.css({
			top: height / 2 - (infoPopup.outerHeight() + 20),
			left: width / 2 - infoPopup.outerWidth() / 2,
			scale: 0
		})

		infoPopup.transition({
			scale: 1
		})
	}

	function removeInfoPopup() {
		infoPopup.off();
		infoPopup.transition({
			scale: 0,
			complete: function() {
				$(this).remove()
			}
		})
		infoPopup = null;
	}

	function resetFocus(){
		currentResultFocus = null;
		currentActiveNetwork = null;
		if(infoPopup) removeInfoPopup();
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

	function updateViewSettings() {
		var settings = {};
		if (currentResultFocus) {
			settings[currentResultFocus.type] = currentResultFocus.id;
		}
		APP.permalink.viewSettings = settings
		APP.permalink.go();
	}

	function deleteNetwork() {
		resetNodes(nodes)
		resetNodes(links)
		nodes = []
		links = []
		if (infoPopup) removeInfoPopup();
		if (self.system) {
			self.system.nodes(nodes);
			self.system.force("link").links(links);
			self.system.stop()
			self.system = null;
		}
		$("#network-wrapper").remove();
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

	function pause() {
		self.system.stop()
	}

	function restart() {
		self.system.alpha(1).restart()
	}
}