;(function (window, $, d3) {
  function init () {
    var self = this
    self.enter = enter
    self.exit = exit

    var svg = d3.select('#onboarding-view .packing svg').append('g')

    var colors = ['#F28244', '#00A9C2', '#E36556', '#8579B6', '#B164A5', '#F7C589', '#80D4E1', '#F3B4B9', '#B3ABD1', '#D8B1D2']

    var data = [{label: 'education', value: 200},
      {label: 'healthcare', value: 180},
      {label: 'democracy', value: 160},
      {label: 'environment', value: 230},
      {label: 'employment', value: 200}]

    for (var i = 0; i < 5; ++i) {
      data.push({label: '', value: Math.random() * 40})
    }

    function enter () {
      var w = 500// cont.width()
      var h = 500// cont.height()

      var struct = d3.hierarchy({root: 'root', children: data})
        .sum(function (d, i) {
          return d.value
        })
      var pack = d3.pack()
        .size([w, h])
        .padding([5])

      var nodes = pack(struct)
      console.log(nodes)

      var elemns = svg.selectAll('g')
        .data(nodes.children)
        .enter()
        .append('g')

      elemns.append('circle')
        .style('fill', function (d, i) {
          return colors[i]
        })
        .attr('r', 0)
        .attr('cx', function (d, i) {
          return d.x
        })
        .attr('cy', function (d, i) {
          return d.y
        })
        .transition()
        .duration(1000)
        .delay(function (d, i) {
          return i * 200 + 3500
        })
        .attr('r', function (d, i) {
          return d.r
        })

      elemns.append('text')
        .style('fill', 'black')
        .style('opacity', 0)
        .style('text-transform', 'uppercase')
        .style('font-family', 'Montserrat')
        .style('font-weight', 'bold')
        .text(function (d, i) {
          return d.data.label
        })
        .attr('dx', function (d, i) {
          return d.x
        })
        .attr('dy', function (d, i) {
          return d.y + 5
        })
        .transition()
        .duration(750)
        .delay(function (d, i) {
          return i * 200 + 4500
        })
        .style('opacity', 1)
    }

    function exit () {
      svg.selectAll('text')
        .transition()
        .duration(500)
        .style('opacity', 0)

      svg.selectAll('circle')
        .transition()
        .duration(500)
        .delay(function (d, i) {
          return i * 100
        })
        .attr('r', 0)
    }
  }

  window.OnBoardingSvg = init
})(window, window.jQuery, window.d3)
