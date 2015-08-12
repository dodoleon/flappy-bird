var WebSocketServer = require('websocket').server;
var http = require('http');

var server = http.createServer(function(request, response) {
});
server.listen(1337, function() { });

// create the server
wsServer = new WebSocketServer({
    httpServer: server
});

// store all connected clients
var clients = [];

wsServer.on('request', function(request) {
	console.log("Connected!");
    var connection = request.accept(null, request.origin);
	var index = clients.push(connection)-1;
    // Simply pass any received messages onto all other clients
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            for (var i=0; i < clients.length; i++) {
                //if (i != index) {
                    //console.log(message.utf8Data);
                	clients[i].sendUTF(message.utf8Data);
                //}
            }
        }
    });

    connection.on('close', function(connection) {
        clients.splice(index, 1);
    });
});