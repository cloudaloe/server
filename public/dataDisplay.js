var clientCodeDebug = 'low'; // need to actually pass its value from the server 
var data, series;

function d3VisualSanity() {
	// sanity checking d3 is working by drawing a meaningless box
	// the page will typically never invoke it but it can be invoked 
	// from the browser console
	chart.append("svg:rect").attr("x", 100).attr("y", 100).attr("width", 100).attr("height", 100); }
	
function loadCSV(fileName) {
	// this function is no good for real-world interactions, as the callback can't
	// be dynamically told where to put the loaded data, and also because it can't
	// use https only http. 
	d3.csv(fileName, function(csvData) 
	{
		if (csvData) 
		{
			data = csvData;
			if (clientCodeDebug == 'high') {
				//show the data as a browsable browser console object
				console.dir(data); }
			else;
			dataReady();
		}
		else 
			alert("failed loading data file" + fileName);
	}); }

function initializeBackground() {
	// benign page load transitions	
	d3.select("body").transition()
		.style("background-color", "white")
		.duration(500).ease("linear"); }
	
function QuestionContainer() {
	// benign page load transitions
	var questionContainer = d3.select("#questionContainer");
	questionContainer.transition().style("margin-top", "1%").duration(1000).ease("cubic-in-out");	}

/*function columnsFromCube(dataCube, x, y) {
	return dataCube.map(function(value) 
		{
			return ({x: parse(value[x]).getTime() , y: parseFloat(value[y])});
		});}*/
		
function extractSeries(cube, x, y) {
	return cube.map(function(value) 
		{
			return ({x: parse(value[x]).getTime() , y: parseFloat(value[y])});
		});}

	
function dataReady() {
	series = extractSeries(data, 'Time', 'Data Size');
	//var series2 = columnsFromCube(data, 'Time', 'Index Size');			
	console.dir(data);
	console.dir(series);			
	initializeChartSpace();	
	initSvg();		
}

// pull csv file from the server, asynchronously for now
loadCSV("table2.csv");		
var parse = d3.time.format("%d/%m/%Y %H:%M").parse;	// format specifiers as per http://tinyurl.com/cmakk7e
