// websocket模拟器
// cd到ws.js文件目录，使用node ws.js 开启模拟器
// #!/usr/bin/env node
var WebSocketServer = require('websocket').server;
var http = require('http');
var port = 8005;
var server = http.createServer(function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});
server.listen(port, function() {
    console.log((new Date()) + ' Server is listening on port ' + port);
});

wsServer = new WebSocketServer({
    httpServer: server,
    // You should not use autoAcceptConnections for production
    // applications, as it defeats all standard cross-origin protection
    // facilities built into the protocol and the browser.  You should
    // *always* verify the connection's origin and decide whether or not
    // to accept it.
    autoAcceptConnections: false
});
 
function originIsAllowed(origin) {
  // put logic here to detect whether the specified origin is allowed.
  return true;
}
 
var inter = null;
wsServer.on('request', function(request) {
    if (!originIsAllowed(request.origin)) {
      // Make sure we only accept requests from an allowed origin
      request.reject();
      console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
      return;
    }
    console.log(request.resource, request.requestedProtocols)
    var connection = request.accept(null, request.origin);
    console.log((new Date()) + ' Connection accepted.');
    if(request.resource === '/ws/test'){
        inter = setInterval(() => {
            console.log('1111')
            connection.sendUTF('test');
        }, 1000);
    }else if(request.resource === '/ws/url'){
        inter = setInterval(() => {
            console.log('222')
            connection.sendUTF('aasdasdadasd');
        }, 1000);
    }
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log('Received Message: ' + message.utf8Data);
            connection.sendUTF(message.utf8Data);
        }
        else if (message.type === 'binary') {
            console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
            connection.sendBytes(message.binaryData);
        }
    });
    // if('echo-protocol-aaa'.indexOf(request.requestedProtocols) !== -1){
    //     console.log('aaa');
    //     var connection = request.accept(null, request.origin);
    //     console.log((new Date()) + ' Connection accepted.');
    //     inter = setInterval(() => {
    //         console.log('1111')
    //         connection.sendUTF('aasdasdadasd');
    //     }, 1000);
    //     connection.on('message', function(message) {
    //         if (message.type === 'utf8') {
    //             console.log('Received Message: ' + message.utf8Data);
    //             connection.sendUTF(message.utf8Data + 'a');
                
    //         }
    //         else if (message.type === 'binary') {
    //             console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
    //             connection.sendBytes(message.binaryData);
    //         }
    //     });
    // }else if('echo-protocol-bbb'.indexOf(request.requestedProtocols) !== -1){
    //     var connection = request.accept('echo-protocol-bbb', request.origin);
    //     console.log((new Date()) + ' Connection accepted.');
    //     connection.on('message', function(message) {
    //         if (message.type === 'utf8') {
    //             console.log('Received Message: ' + message.utf8Data);
    //             connection.sendUTF(message.utf8Data + 'b');
    //         }
    //         else if (message.type === 'binary') {
    //             console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
    //             connection.sendBytes(message.binaryData);
    //         }
    //     });
    // }
    
    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
        clearInterval(inter)
    });
});