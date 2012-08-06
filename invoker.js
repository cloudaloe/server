//
// New module for UI leaden management - not stable and should not be run other than for development
// Launches on the command prompt through entering: node invoker.js (after npm install socket.io express)
//

var fs = require('fs');

var fs = require('fs')
var app = require('http').createServer(handler)
var io = require('socket.io').listen(app)
var static = require('node-static');
var file = new(static.Server)('./public');
var port = 1337;

staticContentServer = new static.Server('./public', { cache: false });
app.listen(port);

io.sockets.on('connection', function (socket) {
	socket.emit('helloClient', { payload: 'no special info...' });
	socket.on('runNow', function (clientObject) {
		console.log("Request to invoke the agent received from client, " + clientObject.runParams + ".");
		console.log('About to invoke the agent....');				
		invokeHeadless();
	});
});


var agentRunning=false;

//try later to incorporate this library
//var nodetime = require('nodetime');
//nodetime.profile();

console.log('Uber Agent is up. Its UI listening on http://127.0.0.1:' + port + '.\n');

function handler(request, response) {
	console.log('Received request - method: ' + request.method + ' url: ' + request.url);
	if (request.method == 'GET') 
		switch(request.url)
		{
			case '/': 
				// serves the html page to the browser
				// need to cache the file more intelligently for scalability
				// nice to have: log the specific error on the server-side
				request.url += 'clientPage.html';
				staticContentServer.serve(request, response);
				break;
			default:
				staticContentServer.serve(request, response);
			/*
			default:
				response.writeHead(200, {'Content-Type': 'text/plain'});	
				response.end('Oops, the requested page was not found....');	
			*/
		}	
}

// problem - this doesn't stream the agent log on screen, only shows it once the agent finishes off
// should use Angular / Meteor / Ajax to stream it
// later also streamm it into a usable place on screen
// later also address the horrible dull formatting
function invoke(response){

	agentRunning=true;
	var time = process.hrtime();
	var spawn = require('child_process').spawn
	child=spawn('java',['-jar', 'target/data-obtainer.jar'])	
	
	//child.stdout.on('data', function (data) { response.write(String(data)); });
	child.stdout.on('data', function (data) { response.write(String(data)); });	
	child.stderr.on('data', function (data) { process.stdout.write('(stderr:) ' + String(data)); });
	child.on('exit', function (code) { 
		invocationDuration = process.hrtime(time);	
		console.log('Child agent finished with code ' + code + "," + " having operated for %d seconds and %d millieseoncds.", invocationDuration[0], invocationDuration[1]/1000000); 
		agentRunning=false;
		response.end();		
	});
}

function invokeHeadless(){

	agentRunning=true;
	var time = process.hrtime();
	var spawn = require('child_process').spawn
	child=spawn('java',['-jar', 'data-obtainer.jar'])	
	
	child.stdout.on('data', function (data) { });	
	child.stderr.on('data', function (data) { });
	child.on('exit', function (code) { 
		invocationDuration = process.hrtime(time);	
		console.log('Child agent finished with code ' + code + "," + " having operated for %d seconds and %d millieseoncds.", invocationDuration[0], invocationDuration[1]/1000000); 
		agentRunning=false;
	});
}
