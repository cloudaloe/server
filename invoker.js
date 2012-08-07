//
// Module for UI leaden agent management
// Launches on the command prompt through entering: node invoker.js (after some npm installs)
//

//var fs 	= require('fs');
var nconf = require('nconf'); 
nconf.file({ file: 'config/config.json'});
var agentIntervalSeconds = nconf.get('agentIntervalSeconds');
var app = require('http').createServer(handler)
var io = require('socket.io').listen(app)
io.set('log level', 2); 

var static = require('node-static'); 
staticContentServer = new static.Server('./public', { cache: false });

//
// Must add thorough error handling here
//
var port = nconf.get('server:port');
app.listen(port);

io.sockets.on('connection', function (socket) {
	socket.emit('agentStatus', agentRunning);
	socket.on('runNow', function (clientObject) {
		if (agentRunning) 
		{ 
			console.log('Request to invoke the agent received from client, but the agent is already running') 
		}
		else
		{
			console.log("Request to invoke the agent received from client. Params: " + clientObject.runParams + ".");
			console.log('About to invoke the agent....');				
			invoke(socket);
		}
	});
});

var agentRunning=false;

//try later to incorporate this library
//var nodetime = require('nodetime');
//nodetime.profile();

console.log('Uber Agent started - UI listening on http://127.0.0.1:' + port + '.');
if (agentIntervalSeconds) 
	{console.log('Agent interval is ' + agentIntervalSeconds +' seconds but not yet implemented.');}
else
	{console.log('Agent interval not yet set.');}

function handler(request, response) {
	console.log('Received request - method: ' + request.method + ' url: ' + request.url);
	if (request.method == 'GET') 
		switch(request.url)
		{
			//
			// Consider adding: nice error page for not-found files.
			// 					currently returns status 404 and a blank page for not-found files
			//
			case '/': 
				// serves the main html page to the browser
				request.url += 'clientPage.html';
				staticContentServer.serve(request, response);
				break;
			default:
				// this is for when the html page causes the browser to locally load css and js libraries
				staticContentServer.serve(request, response);
			/*
			default:
				response.writeHead(200, {'Content-Type': 'text/plain'});	
				response.end('Oops, the requested page was not found....');	
			*/
		}	
}

function invoke(socket){

	var time = process.hrtime();
	var spawn = require('child_process').spawn
	
	agentRunning=true;
	socket.emit('agentStatus', agentRunning);		
		
	child=spawn('java',['-jar', 'data-obtainer.jar'])	
		
	child.stdout.on('data', function (data) { socket.emit('agentStdout', String(data)) });	
	child.stderr.on('data', function (data) { socket.emit('agentStderr', String(data)) });	
	child.on('exit', function (code) { 
		invocationDuration = process.hrtime(time);	
		console.log('Agent finished with code ' + code + "," + " having operated for %d seconds and %d millieseoncds.", invocationDuration[0], invocationDuration[1]/1000000); 
		
		agentRunning=false;
		socket.emit('agentStatus', agentRunning);		
	});
}

function DeprecatedInvoke(response){
	//
	// ultimately, throw this function away
	//
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
