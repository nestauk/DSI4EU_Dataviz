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

		drawCanvasNetwork()
	}

	function drawCanvasNetwork() {
		self.system.on("tick", update);
		console.log(window.devicePixelRatio)

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
		
		if (window.devicePixelRatio > 1) {
			scaleCanvas(canvas)
		}

		function update() {
			var r = 4;

			c.clearRect(0, 0, canvas.width(), canvas.height());
			c.save();

			links.forEach(function(d) {
				c.strokeStyle = "lightgrey";
				c.lineWidth = 1;
				c.beginPath();
				c.moveTo(d.source.x, d.source.y);
				c.lineTo(d.target.x, d.target.y);
				c.stroke();
			});

			nodes.forEach(function(d) {
				if (d.type === 'prj') c.fillStyle = "salmon";
				else c.fillStyle = "steelblue";
				c.beginPath();
				c.moveTo(d.x + r, d.y);
				c.arc(d.x, d.y, r, 0, 2 * Math.PI);
				c.fill();
			});

			c.restore();
		}
	}

	function scaleCanvas(canvas){
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

		console.log(all)


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