function OrgPanel() {
	var self = this;
	self.fillHeader = fillHeader;
	self.prepareRadarData = prepareRadarData;
	self.drawRadar = drawRadar;

	function fillHeader(_selectedOrg) {
		$(".org-panel-map-container h2").html(_selectedOrg.name);
		$(".org-panel-map-container .org-type").html(_selectedOrg.organisation_type);
		$(".org-panel-map-container .org-panel-scrolling p").html(_selectedOrg.short_description);
	}

	function prepareRadarData(_selectedOrg, field) {
		var orgPrjs = _selectedOrg.linked_prjs;
		var fieldCountsInit = [];
		orgPrjs.forEach(function (d) {
			d[field].forEach(function (e){
				fieldCountsInit.push({
					name: e,
					count: 0
				})
			})
		})
		var fieldCounts = _.uniqWith(fieldCountsInit, _.isEqual);
		orgPrjs.forEach(function (d) {
			d[field].forEach(function (e){
				var el = _.find(fieldCounts, function(o) { return o.name == e; });
				el.count++;
			})
		})
		return fieldCounts;
	}

	function drawRadar(data) {

    d3.select(".radar-svg").remove();

		var numInd = data.length, //number of values
				theta = 2 * Math.PI / numInd,
				maxScaleValue;

    var maxCountValue = d3.max(data, function(d){
      return d.count;
    })
    
    var width = $(".modal-panel.org-panel-map").width()*0.8,
        height = width;

    maxScaleValue = width*0.48;

    var rScale = d3.scaleLinear()
      .domain([0, maxCountValue])
      .range([0, maxScaleValue])

    var polarLineGenerator = d3.line()
      .x(function(d, i){
        return(rScale(d.count) * Math.cos(i * theta));
      })
      .y(function(d, i){
        return(rScale(d.count) * Math.sin(i * theta));
      }) 

    var svg = d3.select(".radar-chart").append("svg")
      .attr("width", width)
      .attr("height", height)
        .attr("class", "radar-svg")
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var uniqData = _.uniqBy(data, 'count');

    svg.selectAll(".axis-circle")
    	.data(uniqData)
    	.enter()
    	.append("circle")
        .attr("class", "axis-circle")
      	.attr("cx", 0)
      	.attr("cy", 0)
      	.attr("r", function (d) {
      		return rScale(d.count);
      	})

    svg.selectAll(".axis-line")
    	.data(data)
    	.enter()
    	.append("line")
    		.attr("class", "axis-circle")
      	.attr("x1", 0)
      	.attr("y1", 0)
      	.attr("x2", function(d, i) { return(rScale(maxCountValue) * Math.cos(i * theta)); })
      	.attr("y2", function(d, i) { return(rScale(maxCountValue) * Math.sin(i * theta)); })

    svg.selectAll('.radar-path')
      .data([data])
      .enter()
      .append('path')
        .attr('class', 'radar-path')
        .attr('d', function(d){
          return polarLineGenerator(d);
        })
        .attr('fill-opacity', .9)

	}

  function drawBarChart(data) {

  }

}