var express = require('express');
var app = express();
var serveStatic = require('serve-static');
var diff = require('diff');

app.use("/vendor", serveStatic("node_modules"));

var http = require('http').Server(app);
var io = require('socket.io')(http);

var fileContents = "This is a file\nWe should change it\nThis is a third line";

app.use("/", serveStatic("public"));

io.on('connection', function(socket) {
    console.log("User in...");
    io.emit('server change', fileContents);
    
    socket.on('disconnect', function(msg) {
        console.log("User out...");
    });
    
    socket.on('chat message', function(msg) {
        io.emit('chat message', msg);
    });
    
    socket.on('client change', function(msg) {
        console.log(msg);
        
        fileContents = diff.applyPatch(fileContents, msg);
        
//        console.log("RESULT CHANGE");
//        console.log("=================");
//        console.log(fileContents);
        // Update the file here
        //io.emit('outgoing change', fileContents);
    });
});

setInterval(function() {
    io.emit('server change', fileContents);
}, 5000);

http.listen(8080, function() {
    console.log("On 8080...");
});