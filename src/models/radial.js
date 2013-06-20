nv.models.radial = function() {

  //============================================================
  // Public Variables with Default Settings
  //------------------------------------------------------------

  var margin = {top: 0, right: 0, bottom: 0, left: 0}
    , width = 500
    , height = 500
    , getY = function(d) { return d.y }
    , xScale = d3.scale.linear()
    , yScale = d3.scale.linear()
    , yDomain = null
    , innerRadius = 0
    , id = Math.floor(Math.random() * 10000) //Create semi-unique ID in case user doesn't select one
    , fillColor = nv.utils.defaultColor()
    , strokeColor = nv.utils.defaultColor()
    , strokeWidth = 2
    , strokeInnerWidth = 1
    , startAngle = 0
    , endAngle = 360
    , dispatch = d3.dispatch('chartClick', 'elementClick', 'elementDblClick', 'elementMouseover', 'elementMouseout')
    ;

  //============================================================


  function chart(selection) {
    selection.each(function(data) {
      var availableWidth = width - margin.left - margin.right,
          availableHeight = height - margin.top - margin.bottom,
          xc = availableWidth / 2,
          yc = availableHeight / 2,
          radius = Math.min(availableWidth, availableHeight) / 2,
          maxRadius = radius - (radius / 5) - innerRadius,
          container = d3.select(this);


      //------------------------------------------------------------
      // Setup containers and skeleton of chart

      var wrap = container.selectAll('.nv-wrap.nv-radial').data([data]);
      var wrapEnter = wrap.enter().append('g').attr('class','nvd3 nv-wrap nv-radial nv-chart-' + id);
      var gEnter = wrapEnter.append('g');
      var g = wrap.select('g');

      gEnter.append('g').attr('class', 'nv-radial-points');

      wrap.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

      //------------------------------------------------------------


      container
          .on('click', function(d,i) {
              dispatch.chartClick({
                  data: d,
                  index: i,
                  pos: d3.event,
                  id: id
              });
          });


      var startRadian = startAngle / 180 * Math.PI;
      var endRadian = endAngle / 180 * Math.PI;
      // Set scale range
      xScale.domain([0, data.length - 1]);
      xScale.range([startRadian, endRadian]);

      if(yDomain) {
        yScale.domain(yDomain);
      } else {
        var ymin = d3.min(data, getY);
        var ymax = d3.max(data, getY);
        yScale.domain([ymin, ymax]);
      }

      yScale.range([0, 1]);

      var line = d3.svg.line.radial()
                  .interpolate("linear")
                  .tension(0)
                  .radius(function(d, i) {
                      return yScale(getY(d, i)) * maxRadius + innerRadius;
                  })
                  .angle(function(d, i) {
                      return xScale(i);
                  });

      wrap.select('.nv-radial-points')
          .append("path")
          .datum(data)
          .attr("d", line)
          .attr("transform", "translate(" + xc + ", " + yc + ")")
          .attr("fill", fillColor)
          .attr("stroke", strokeColor)
          .attr("stroke-width", strokeWidth);

      var points = wrap.select('.nv-radial-points').selectAll('.nv-radial-point')
          .data(data).enter();

      points.append('line')
            .attr('x1', xc)
            .attr('y1', yc)
            .attr('x2', function(d, i){
                var angle = xScale(i) - Math.PI / 2;
                var dist = yScale(getY(d, i)) * maxRadius + innerRadius;
                return xc + Math.cos(angle) * dist;
            })
            .attr('y2', function(d, i){
                var angle = xScale(i) - Math.PI / 2;
                var dist = yScale(getY(d, i)) * maxRadius + innerRadius;
                return yc + Math.sin(angle) * dist;
            })
            .attr('stroke', strokeColor)
            .attr('stroke-width', strokeInnerWidth);

    });

    return chart;
  }


  //============================================================
  // Expose Public Variables
  //------------------------------------------------------------

  chart.dispatch = dispatch;

  chart.margin = function(_) {
    if (!arguments.length) return margin;
    margin.top    = typeof _.top    != 'undefined' ? _.top    : margin.top;
    margin.right  = typeof _.right  != 'undefined' ? _.right  : margin.right;
    margin.bottom = typeof _.bottom != 'undefined' ? _.bottom : margin.bottom;
    margin.left   = typeof _.left   != 'undefined' ? _.left   : margin.left;
    return chart;
  };

  chart.width = function(_) {
    if (!arguments.length) return width;
    width = _;
    return chart;
  };

  chart.height = function(_) {
    if (!arguments.length) return height;
    height = _;
    return chart;
  };

  chart.y = function(_) {
    if (!arguments.length) return getY;
    getY = d3.functor(_);
    return chart;
  };

   chart.xScale = function(_) {
    if (!arguments.length) return xScale;
    xScale = _;
    return chart;
  };

  chart.yScale = function(_) {
    if (!arguments.length) return yScale;
    yScale = _;
    return chart;
  };

  chart.yDomain = function(_) {
    if (!arguments.length) return yDomain;
    yDomain = _;
    return chart;
  };

  chart.innerRadius = function(_) {
    if (!arguments.length) return innerRadius;
    innerRadius = _;
    return chart;
  };

  chart.startAngle = function(_) {
    if (!arguments.length) return startAngle;
    startAngle = _;
    return chart;
  };

  chart.endAngle = function(_) {
    if (!arguments.length) return endAngle;
    endAngle = _;
    return chart;
  };

  chart.id = function(_) {
    if (!arguments.length) return id;
    id = _;
    return chart;
  };

  chart.fillColor = function(_) {
    if (!arguments.length) return fillColor;
    fillColor = nv.utils.getColor(_);
    return chart;
  };

  chart.strokeColor = function(_) {
    if (!arguments.length) return strokeColor;
    strokeColor = nv.utils.getColor(_);
    return chart;
  };

  chart.strokeWidth = function(_) {
    if (!arguments.length) return strokeWidth;
    strokeWidth = nv.utils.getColor(_);
    return chart;
  };

  chart.strokeInnerWidth = function(_) {
    if (!arguments.length) return strokeInnerWidth;
    strokeInnerWidth = nv.utils.getColor(_);
    return chart;
  };

  return chart;
}