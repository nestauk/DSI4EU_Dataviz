;(function (window, $, d3) {
  function init () {
    var self = this
    self.enter = enter
    self.exit = exit

    var cont = $('#onboarding-view .upper')
    var svg = d3.select('#onboarding-view .svg svg')

    var data = [{label: 'AAAAAAAAAAAAAAA', value: 200}, {label: 'AAA', value: 180}, {label: 'AAA', value: 160}, {label: 'AAA', value: 230},
    {label: 'AAA', value: 200}]

    function enter () {
      var w = cont.width()
      var h = cont.height()

      var struct = d3.hierarchy({root: 'root', children: data})
        .sum(function (d, i) {
          return d.value
        })
      var pack = d3.pack()
        .size([w, h])

      var nodes = pack(struct)
      console.log(nodes)

      var elemns = svg.selectAll('g')
        .data(nodes.children)
        .enter()
        .append('g')

      elemns.append('circle')
        .style('fill', 'blue')
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
        .style('fill', 'white')
        .style('opacity', 0)
        .text(function (d, i) {
          return d.data.label
        })
        .attr('dx', function (d, i) {
          return d.x
        })
        .attr('dy', function (d, i) {
          return d.y
        })
        .transition()
        .duration(750)
        .delay(function (d, i) {
          return i * 100 + 500
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
