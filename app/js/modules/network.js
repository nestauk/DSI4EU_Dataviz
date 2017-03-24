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
	var translateX = 0, lastX = false;
	var translateY = 0, lastY = false;
	var dragging = false;

	var minScale = .5
	var maxScale = 2
	var scaleFactor = .1;
	var initialScale = scale = .8;


	function createNetwork() {
		resetTransforms()
		deleteNetwork()
		lookupMap = {};
		APP.ui.updateViewFunction = createNetwork;

		width = $("#main-view").width();
		height = $("#main-view").height();

		if(self.showLinkedOnly){ 
			var prjs = _.filter(APP.filter.prjs, function(p){
				return p.linked_orgs.length > 1;
			})
			var orgs = _.filter(APP.filter.orgs, function(o){
				return !_.isEmpty(o.shared_prjs);
			})
		} else {
			var orgs = APP.filter.orgs
			var prjs = APP.filter.prjs
		}


		orgs = _.filter(orgs, function(o) {
			return !_.isEmpty(o.linked_prjs) && _.some(o.linked_prjs, function(p) {
				if(self.showLinkedOnly) return _.includes(APP.filter.prjs, p) && p.linked_orgs.length > 1;
				return _.includes(APP.filter.prjs, p);
			})
		});
		prjs = _.filter(prjs, function(p) {
			return !_.isEmpty(p.linked_orgs) && _.some(p.linked_orgs, function(o) {
				if(self.showLinkedOnly) return _.includes(APP.filter.orgs, o) && !_.isEmpty(o.shared_prjs);
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
				var mx = e.pageX - translateX / scale;
				var my = e.pageY - translateY / scale;
				offsetX = -(mx * delta);
				offsetY = -(my * delta);
				translateX += offsetX;
				translateY += offsetY;
				update();
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

			// dumper
			// var def = []
			// nodes.forEach(function(d, i){
			// 	var p = (d.linked_prjs) ? d.linked_prjs.length : 1
			// 	def.push({x:d.x/width, y:d.y/height, t:d.type, p:p})
			// })
			// console.log(JSON.stringify(def))

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

	function resetTransforms(){
		translateX = 0;
		translateY = 0;
		scale = initialScale;
	}

	function deleteNetwork() {
		self.system = null;
		$("#network-container").remove();
		$("#network-lookup").remove();
		lookupMap = null;
		$(document).off();
	}

}