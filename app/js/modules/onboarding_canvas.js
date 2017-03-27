function OnBoardingCanvas(svg, _app) {
	var self = this;
    self.init = init
    self.stop = stop
    self.one = one
    self.two = two
    self.three = three
    self.four = four
    self.five = five


    var cont = $('#onboarding-view')
    var w = cont.width()
    var h = cont.height()

    var s = Math.max(w, h)

    


    var canvas = cont.find('canvas').get(0)
    canvas.width = w
    canvas.height = h

    var timer

    var ctx = canvas.getContext('2d')
    var detachContainer = document.createElement('custom')
    var dataCont = d3.select(detachContainer)

	var orgs
    var prjs
    var conn

    var mapx = d3.scaleLinear()
        .domain([0, 500])
        .range([0, w])

    var mapy = d3.scaleLinear()
        .domain([0, 500])
        .range([0, h])

    var mapr = (w>h) ? mapy : mapx

	function draw() {
        var node

		ctx.fillStyle = "#fff";
		ctx.rect(0,0,w,h);
		ctx.fill();

        conn.each(function(d) {
            node = d3.select(this);
            ctx.beginPath();
            ctx.strokeStyle = rgbObToStr( node.attr("stroke"), node.attr("opacity") )
            ctx.moveTo(mapx(node.attr("x1")), mapy(node.attr("y1")));
            ctx.lineTo(mapx(node.attr("x2")), mapy(node.attr("y2")));
            ctx.stroke();
            ctx.closePath();
        });

		orgs.each(function(d) {
		  	node = d3.select(this);
		  	ctx.beginPath();
		  	ctx.fillStyle = rgbObToStr( node.attr("fill"), node.attr("opacity") )
		  	ctx.arc( mapx(node.attr("cx")), mapy(node.attr("cy")), mapr(node.attr("r")), 0, Math.PI*2);
		  	ctx.fill();
		  	ctx.closePath();
		});
        prjs.each(function(d) {
            node = d3.select(this);
            ctx.beginPath();
            ctx.fillStyle = rgbObToStr( node.attr("fill"), node.attr("opacity") )
            ctx.arc( mapx(node.attr("cx")), mapy(node.attr("cy")), mapr(node.attr("r")), 0, Math.PI*2);
            ctx.fill();
            ctx.closePath();
        });
        
	}







	function one(){
        orgs.transition()
            .duration(2000)
            .delay(function(d, i){
                return Math.random()*5000
            })
            .ease(d3.easeExp)
            .attr('opacity', 1)
            .attr('r', function(){
                return d3.select(this).attr('r') / 5
            })

	}


	function two(){
        prjs.transition()
            .duration(2000)
            .delay(function(d, i){
                return Math.random()*5000
            })
            .ease(d3.easeExp)
            .attr('opacity', 1)
            .attr('r', function(){
                return d3.select(this).attr('r') / 5
            })
	}

    function three(){
        conn.transition()
            .duration(3000)
            .delay(function(d, i){
                return Math.random()*5000
            })
            .attr('opacity', 1)
            .transition()
            .duration(2000)
            .attr('opacity', .2)

    }

    function four(){
        enterElements('prj', dataset.prjs)
    }

    function five(){
        enterElements('prj', dataset.prjs)
    }

    function init(){

        var svg = d3.select('#onboarding-view svg')
            .style('width', s)
            .style('height', s)
            .style('display', 'none')

        orgs = svg.selectAll('#org > *')
            .attr('opacity', 0)
            .attr('r', function(){
                var r = (d3.select(this).attr('r')>0) ? d3.select(this).attr('r') : d3.select(this).attr('rx')
                return r * 5
            })

        prjs = svg.selectAll('#prj > *')
            .attr('opacity', 0)
            .attr('r', function(){
                var r = (d3.select(this).attr('r')>0) ? d3.select(this).attr('r') : d3.select(this).attr('rx')
                return r * 5
            })

        conn = svg.selectAll('#conn > *')
            .attr('stroke', '#111111')
            .attr('opacity', 0)

        timer = d3.timer(draw);
    }

    function stop(){
        timer.stop()
    }


    function hexToRgb(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    function rgbObToStr(hex, a){
        var rgb = hexToRgb(hex)
        var str = ''
        if(rgb){
            str = 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',' + a + ')'
        }
        return str
    }

}