function OnBoardingCanvas(_canvas, _app) {
	var self = this;


    self.init = init
    self.stop = stop
    self.one = one
    self.two = two
    self.three = three
    self.four = four
    self.five = five

	var canvas = _canvas
	var w = canvas.width
	var h = canvas.height

    var timer

	var ctx = canvas.getContext("2d")

	var detachContainer = document.createElement('custom')
	var dataCont = d3.select(detachContainer)

	function draw() {

		ctx.fillStyle = "#fff";
		ctx.rect(0,0,w,h);
		ctx.fill();

		var elements = dataCont.selectAll("custom");
		elements.each(function(d) {
		  	var node = d3.select(this);
		  	ctx.beginPath();
		  	ctx.fillStyle = node.attr("fill")
		  	ctx.arc(node.attr("cx"), node.attr("cy"), node.attr("r"), 0, Math.PI*2);
		  	ctx.fill();
		  	ctx.closePath();
		});
	}


	var mapx = d3.scaleLinear()
		.domain([0, 1])
		.range([0, w])

	var mapy = d3.scaleLinear()
		.domain([0, 1])
		.range([0, h])

    var pointGrid = d3.grid()
            .points()
            .size([1,1])



	function enterElements(selector, data){

		var size = pointGrid.nodeSize()

		var elemns = dataCont.selectAll("custom")
    		.data(data)

    	elemns.enter()
    		.append('custom')
    		.attr('cx', function(d, i){
    			return mapx(d.x) + mapx(Math.random()*.4-.2)
    		})
    		.attr('cy', function(d, i){
    			return mapy(d.y) + mapx(Math.random()*.4-.2)
    		})
    		.attr('fill', function(d, i){
    			if(selector=='org'){
    				return 'rgba(125,180,220,0)';
    			}else{
    				return 'rgba(255,187,126,0)';
    			}
     		})
    		.attr('r', function(d, i){
    			if(selector=='org'){
    				return d.linked_prjs && d.linked_prjs.length>0 ? d.linked_prjs.length+1 : 1
    			}else{
    				return d.linked_orgs && d.linked_orgs.length>0 ? d.linked_orgs.length+1 : 1
    			}
     		})
    		.merge(elemns)
    		.transition()
    		.ease(d3.easeExp)
    		.delay(function(d, i){
    			return i*3
    		})
    		.duration(2000)
			.attr('fill', function(d, i){
    			if(selector=='org'){
    				return 'rgba(125,180,220,.8)';
    			}else{
    				return 'rgba(255,187,126,.8)';
    			}
     		})    		
     		.attr('cx', function(d, i){
    			return mapx(d.x + size[0]/2)
    		})
    		.attr('cy', function(d, i){
    			return mapy(d.y + size[1]/2)
    		})

    	elemns.exit()
    		.transition()
    		.ease(d3.easeExp)
    		.delay(function(d, i){
    			return i*3
    		})
    		.duration(1000)
    		.attr('opacity', 0)
    		.remove()
	}


	function one(){
		enterElements('org', pointGrid(_app.dataset.orgs))
	}


	function two(){
		enterElements('prj', pointGrid(_app.dataset.prjs))
	}

    function three(){
        enterElements('prj', _app.dataset.netDump.nodes)
    }

    function four(){
        enterElements('prj', dataset.prjs)
    }

    function five(){
        enterElements('prj', dataset.prjs)
    }

    function init(){
        timer = d3.timer(draw);
    }

    function stop(){
        timer.stop()
    }


}