var clientCodeDebug = 'low'; // need to actually pass its value from the server 
//var chart = d3.select("#chart");		
//var chart = d3.select("#chartSpace").append("svg:svg");
var data;

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
	d3.select("body").transition()
		.style("background-color", "white")
		.duration(500).ease("linear"); }
	
function initializeView() {
	// benign page load transitions
	var chartSpace = d3.select("#chartSpace");
	chartSpace.transition().style("margin-top", "10%").duration(1000).ease("cubic-in-out");	}
	
function rickshawChart(data) {
	var graph = new Rickshaw.Graph( {
		element: document.querySelector("#chartSpace"), 
		renderer: 'line',				
		padding: {top: 0.2, bottom: 0.02, right: 0.02, left: 0.02},
		series: [{
			color: 'green',
			data: data
		}]
	});

	console.dir(graph);
	graph.render();	}
	
function columnsFromCube(dataCube, x, y) {
	return dataCube.map(function(value) 
		{
			return ({x: parse(value[x]).getTime() , y: parseFloat(value[y])});
		});}
	
function dataReady() {
	var series1 = columnsFromCube(data, 'Time', 'Data Size');
	var series2 = columnsFromCube(data, 'Time', 'Index Size');			
	console.dir(data);
	console.dir(series1);			
	rickshawChart(series1);
}

// pull csv file from the server, asynchronously for now
loadCSV("table2.csv");		
var parse = d3.time.format("%d/%m/%Y %H:%M").parse;	// format specifiers as per http://tinyurl.com/cmakk7e
