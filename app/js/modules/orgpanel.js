function OrgPanel() {
	var self = this;
	self.fillHeader = fillHeader;
	self.prepareData = prepareData;
  self.drawRadar = drawRadar;
  self.drawBarChart = drawBarChart;
	self.deleteOrgPanelItems = deleteOrgPanelItems;


	function fillHeader(_selectedOrg) {
		$(".map-panel-container h2").html(_selectedOrg.name);
		$(".map-panel-container .org-type").html(_selectedOrg.organisation_type);
		$(".map-panel-container .map-panel-scrolling p").html(_selectedOrg.short_description);
	}


	function prepareData(_selectedOrg, field) {
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


	function drawRadar(data, field) {
    d3.select(".radar-chart").select("h3")
      .text(field)
		var numInd = data.length, //number of values
				theta = 2 * Math.PI / numInd,
				maxScaleValue;
    var maxCountValue = d3.max(data, function(d){
      return d.count;
    })
    var width = $(".modal-panel.map-panel").width()*0.8,
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
    var svg = d3.select(".radar").append("svg")
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
    svg.selectAll(".radar-path")
      .data([data])
      .enter()
      .append("path")
        .attr("class", "radar-path")
        .attr("d", function(d){
          return polarLineGenerator(d);
        })
        .attr("fill-opacity", .9)
    svg.selectAll(".radar-dots")
      .data(data)
      .enter()
      .append("circle")
        .attr("class", "radar-dots")
        .attr("cx", function(d, i) { return(rScale(d.count) * Math.cos(i * theta)); })
        .attr("cy", function(d, i) { return(rScale(d.count) * Math.sin(i * theta)); })
        .attr("r", 6)
        .on("mouseover", function (d) {
          var currentDot = d3.select(this);
          svg.append("text")
            .attr("class", "tooltip")
            .text(d.name)
        })
        .on("mouseout", function (d) {
          d3.select(".tooltip").remove();
        })
	}

  function drawBarChart(data, field) {
    data.sort(function (a, b) {
      return a.count < b.count;
    })
    var maxCountValue = d3.max(data, function(d){
      return d.count;
    })
    var rectHeight = 8,
        rectRound = 5,
        textToBarDist = 6,
        barToBarDist = 44,
        offsetDist = 20;
    function hMult() {
      switch(field){
        case "Focus": return 4; break;
        case "Support": return 10; break;
        case "Technology": return 16; break;
        default: return 4; break;
      }
    }
    var width = $(".modal-panel.map-panel").width(),
        height = barToBarDist*hMult();
    maxScaleValue = width;
    var lScale = d3.scaleLinear()
      .domain([0, maxCountValue])
      .range([0, maxScaleValue - 16])
    var barchartDiv = d3.select(".map-panel-scrolling").append("div")
      .attr("class", "bar-chart")
    barchartDiv.append("h3")
      .text(field)
    var barchartItems = barchartDiv.append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("class", "barchart-svg")
        .selectAll(".bar-chart-item."+field)
        .data(data)
        .enter()
          .append("g")
          .attr("class", "bar-chart-item "+field)
    barchartItems.append("text")
      .attr("class", "bar-chart-caption")
      .attr("x", 0)
      .attr("y", function (d, i) {
        return offsetDist + i*barToBarDist;
      })
      .attr("width", width)
      .text(function (d) {
        return d.name+": "+d.count+" projects";
      })
    barchartItems.append("rect")
      .attr("x", 0)
      .attr("y", function (d, i) {
        return offsetDist + textToBarDist + i*barToBarDist;
      })
      .attr("width", function (d) {
        return lScale(d.count);
      })
      .attr("height", rectHeight)
      .attr("rx", rectRound)
      .attr("fill", "white")
  }


  function deleteOrgPanelItems() {
    d3.select(".radar-svg").remove();
    d3.selectAll(".bar-chart").remove();
  }


}