
function initializeChartSpace() {
	// benign page load transitions
	var chartSpace = d3.select("#chartSpace");
	chartSpace.transition().style("margin-top", "10%").duration(1000).ease("cubic-in-out");	
	}

function initSvg() {

var m = [80, 80, 80, 80];
var	vLenPixels, hLenPixels;

var chartArea = d3.select("#chartSpace")
var svgArea = chartArea.append("svg:svg");
svgArea.attr("width", "100%").attr("height", "100%").append("svg:g");
vLenPixels = svgArea.style('height');
hLenPixels = svgArea.style('width');


var hScale = d3.time.scale();
hScale.range([0,parseInt(hLenPixels)]);
hScale.domain([series[0].x, series[series.length - 1].x]);
var hAxis = d3.svg.axis().scale(hScale);

var vScale = d3.scale.linear();
vScale.range([parseInt(vLenPixels),0]);
vScale.domain([0, d3.max(series, function(d) { return d.y; })]);
var vAxis = d3.svg.axis().scale(vScale);

// An area generator, for the light fill.
var area = d3.svg.area()
    .interpolate("monotone")
    .x(function(d) { 
		//console.log(d.x); console.log(hScale(d.x)); 
		return hScale(d.x); })		
    .y0(parseInt(vLenPixels))
    .y1(function(d) { return vScale(d.y); });
	
// Add an SVG element with the desired dimensions and margin.

/*console.log(svg.getAttribute("width"));
console.log(svg.getBBox().height);
console.log(svg.attr("height"));
console.log(svg.style("height"));
console.log(d3.select("#chartSpace").attr("height"));*/
	
// Add the clip path.
  svgArea.append("svg:clipPath")
      .attr("id", "clip")
	.append("svg:rect")
      .attr("width", "100%")
      .attr("height", "100%");

  // Add the area path.
  svgArea.append("svg:path")
      .attr("class", "area")
      .attr("clip-path", "url(#clip)")
      .attr("d", area(series));
}