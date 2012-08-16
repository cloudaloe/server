//var chart = d3.select("#chart");		
//var chart = d3.select("#chartSpace").append("svg:svg");

function initSvg() {

var hScale = d3.time.scale();
hScale.range([0,1000]);
hScale.domain([series[0].x, series[series.length - 1].x]);
var hAxis = d3.svg.axis().scale(hScale);

var vScale = d3.scale.linear();
vScale.range([100,0]);
vScale.domain([0, d3.max(series, function(d) { return d.y; })]);
var vAxis = d3.svg.axis().scale(vScale);

var m = [80, 80, 80, 80],
var	width = "100%",
var	height = "100%"
    
// An area generator, for the light fill.
var area = d3.svg.area()
    .interpolate("monotone")
    .x(function(d) { console.log(d.x); console.log(hScale(d.x)); return hScale(d.x); })
    .y0(100)
    .y1(function(d) { return vScale(d.y); });
	
// Add an SVG element with the desired dimensions and margin.
 var svg = d3.select("#chartSpace").append("svg:svg")
	.attr("width", width) 						
	.attr("height", height)						
	.append("svg:g");

// Add the clip path.
  svg.append("svg:clipPath")
      .attr("id", "clip")
    .append("svg:rect")
      .attr("width", width)
      .attr("height", height);

  // Add the area path.
  svg.append("svg:path")
      .attr("class", "area")
      .attr("clip-path", "url(#clip)")
      .attr("d", area(series));
}